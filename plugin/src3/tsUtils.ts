
import * as tsLib from 'typescript/lib/tsserverlibrary';
import { arrayIterator, reduceIterator, tapIterator } from './iterators';
import { parse } from './parse';
const vueExt = '.vue';
const tsExt = '.temp.ts';
const files: Record<string, TsInfo | VueInfo> = Object.create(null);
let newLineLength: number = 0;
export type UtilsSync = Utils & { synchronize: () => void };
const utils = {
    getLineAndChar: getLineAndChar,
    calculatePosition: calculatePosition,
    isVueFile: isVueFile,
    getContent: getContent,
    synchronizer: synchronizer,
    getStart: getStart,
    getEnd: getEnd,
    outOfBounds: outOfBounds,
    close: close,
    has: hasFile,
    openingFiles: openingFiles,
    updatingFiles: updatingFiles,
    closingFiles: closingFiles,
    toTsFile: toTsFile,
    toVueFile: toVueFile
}
function wasVueFile(file: string) {
    return file.endsWith(vueExt + tsExt);
}
function toVueFile(fileName: string) {
    if (wasVueFile(fileName)) {
        return fromTsFile(fileName);
    }

    if (isVueFile(fileName)) {
        return fileName;
    }

    throw new Error(`Filename is not valid "${fileName}"`);
}
function toTsFile(fileName: string) {
    if (isVueFile(fileName)) {
        return toTsFileInternal(fileName);
    }

    if (wasVueFile(fileName)) {
        return fileName;
    }

    throw new Error(`Filename is not valid "${fileName}"`);
}
export type Utils = typeof utils;

export function getUtils(newLine: string) {
    newLineLength = newLine.length;
    return utils;
}

export type MappingInfo = {
    from: string;
    to: string;
}

export interface OpenFileArguments {
    fileName: string;
    content?: string;
    scriptKind?: tsLib.server.protocol.ScriptKindName | tsLib.ScriptKind;
    hasMixedContent?: boolean;
    projectRootPath?: string;
}


export interface ChangeFileArguments {
    fileName: string;
    changes: Iterator<tsLib.TextChange>;
}
/**
 * given an iterator, it will tap it, and look for vue files
 * 
 * if it finds one, it also pushes the ts virtual version of it to the iterator
 */
function openingFiles(openFiles: Iterator<OpenFileArguments> | undefined): Iterator<OpenFileArguments> | undefined {
    return openFiles && reduceIterator(openFiles, addRequiredFiles);
}
/**
 * given an iterator, it will tap it, and look for vue files
 * 
 * if it finds one, it also pushes the ts virtual version of it to the iterator
 */
function closingFiles(closingFiles: Iterator<string> | undefined): Iterator<string> | undefined {
    return closingFiles && reduceIterator(closingFiles, addClosingFilesFiles);
}
/**
 * given an iterator, it will tap it, and look for vue files,
 * 
 * if it finds one, it also pushes the ts virtual version of it to the iterator
 * 
 * it will also perform the changes on the files, if any
 */
function updatingFiles(updates: Iterator<ChangeFileArguments> | undefined): Iterator<ChangeFileArguments> | undefined {
    return updates && reduceIterator(updates, addUpdates);
}
/**
 * links two files (a vue and a ts file) together
 */
function link(parent: string, child: string) {
    (getFile(parent) as VueInfo).originatedFile = getFile(child) as TsInfo;
    (getFile(child) as TsInfo).originatingFile = getFile(parent) as VueInfo;
}
/**
 * given an open file arg, if its a vue file, it will push a ts virtual file to the stream
 */
function addRequiredFiles(prev: OpenFileArguments[], cur: OpenFileArguments) {
    if (isVueFile(cur.fileName)) {
        const vueFileName = cur.fileName;
        const vueContent = open(vueFileName, cur.content || '', tsLib.ScriptKind.Unknown);
        prev.push({
            fileName: vueContent,
            hasMixedContent: true,
            projectRootPath: cur.projectRootPath,
            scriptKind: tsLib.ScriptKind.Unknown,
            content: vueContent,
        });

        const tsFileName = toTsFileInternal(vueFileName);
        const tsContent = open(tsFileName, vueContent, tsLib.ScriptKind.TS);
        prev.push({
            fileName: tsFileName,
            hasMixedContent: false,
            projectRootPath: cur.projectRootPath,
            scriptKind: tsLib.ScriptKind.TS,
            content: tsContent,
        });

        link(vueFileName, tsFileName);
    } else {
        prev.push(cur);
    }
    return prev;
}
/**
 * given a close file arg, if its a vue file, it will push a ts virtual file to the stream
 */
function addClosingFilesFiles(prev: string[], file: string) {
    if (isVueFile(file)) {
        const vueFileName = file;
        close(vueFileName);
        prev.push(vueFileName);

        const tsFileName = toTsFileInternal(vueFileName);
        close(tsFileName);
        prev.push(tsFileName);
    } else {
        close(file);
        prev.push(file);
    }
    return prev;
}
/**
 * given an update file arg, if its a vue file, it will push a ts virtual file to the stream
 */
function addUpdates(prev: ChangeFileArguments[], change: ChangeFileArguments) {
    if (isVueFile(change.fileName)) {
        const vueChanges = tapIterator(change.changes, applyTextChange, change.fileName);
        prev.push({
            fileName: change.fileName,
            changes: vueChanges,
        });

        const tsChanges = reduceIterator(change.changes, addApplyTextChanges, change.fileName)
        prev.push({
            fileName: toTsFileInternal(change.fileName),
            changes: tsChanges
        });
    } else {
        prev.push(change);
    }
    return prev;
}

/**
 * @internal method
 * it add the changes to the stream, so they get performed in the ts server
 * 
 * it also applies the changes internally, so the start and end position are updated
 */
function addApplyTextChanges(this/*vueFileName*/: string, prev: tsLib.TextChange[], change: tsLib.TextChange) {
    change = {
        newText: change.newText,
        span: {
            length: change.span.length,
            start: calculatePosition({
                from: this/*vueFileName*/,
                to: toTsFileInternal(this/*vueFileName*/)
            }, change.span.start)
        }
    };
    prev.push(change);
    applyTextChange.call(toTsFileInternal(this/*vueFileName*/), change);
    return prev;
}


/**
 * first time a project gets loaded, vscode might have already opened some files
 * 
 * this method is to check that once, at startup, and open the corresponding ts files and never again
 */
function synchronizer(project: tsLib.server.Project) {
    let fn = function () {
        debugger;
        const filesThatMightNeedAdding: OpenFileArguments[] = [];
        const openFiles = project.projectService.openFiles
        project.projectService.openFiles.forEach(file => {
            if (!file) {
                return;
            }
            const info = project.getScriptInfo(file);
            if (!info) {
                return;
            }

            const snap = info.getSnapshot();
            const content = snap.getText(0, snap.getLength());
            if (isVueFile(file) && !openFiles.has(toTsFileInternal(file))) {
                const vueContent = open(file, content, tsLib.ScriptKind.Unknown);
                const tsContent = open(toTsFileInternal(file), vueContent, tsLib.ScriptKind.TS);
                filesThatMightNeedAdding.push({
                    content: tsContent || '',
                    fileName: toTsFileInternal(file),
                    scriptKind: tsLib.ScriptKind.TS,
                    hasMixedContent: false,
                    projectRootPath: project.getCurrentDirectory()
                });
            } else {
                open(file, content, tsLib.ScriptKind.Unknown);
            }
        });

        if (filesThatMightNeedAdding.length) {
            (project.projectService as any).applyChangesInOpenFiles(arrayIterator(filesThatMightNeedAdding));
        }
        // override fn to noop
        fn = () => { };
    }
    return function () {
        fn();
    }
}
/**
 * appends an extension to the file to convert it to a ts file
 */
function toTsFileInternal(fileName: string) {
    return fileName + '.temp.ts';
}
/**
 * update (call version) a files content from a text change
 * returns the change
 */
function applyTextChange(this/*fileName*/: string, change: tsLib.TextChange) {
    update(this, sliceTextChange(getContent(this), change));
    return change;
}
/**
 * update a files content from a text change
 * returns the change
 */
function update(fileName: string, content: string) {
    getFile(fileName).content = content;
}
/**
 * strips the added ts extension to become the original vue file path
 */
function fromTsFile(fileName: string) {
    return fileName.slice(0, tsExt.length);
}
/**
 * overrides the cache with a new file and its content
 * if the kind is TS, the content should be the original vue file always, the parsing is done internally
 */
function open(fileName: string, content: string, kind: tsLib.ScriptKind) {
    if (kind === tsLib.ScriptKind.TS) {
        return setFile(fileName, new TsInfo(content, getFile(fromTsFile(fileName)) as VueInfo)).content;
    }
    return setFile(fileName, new VueInfo(content)).content;
}
/**
 * deletes a file from the cache
 */
function close(fileName: string) {
    if (!hasFile(fileName)) {
        return;
    }
    deleteFile(fileName);
}
/**
 * get the start offset of the file relative to its position in the original vue file, returns 0 if its a vue file
 */
function getStart(file: string) {
    return getFile(file).start;
}
/**
 * get the end offset of the file relative to its position in the original vue file, returns content.length if its a vue file
 */
function getEnd(file: string) {
    return getFile(file).end;
}
/**
 * Calculates the LineAndCharacter for a given pair of files
 * 
 * if "fromFile" is a vue file, it will offset the lines negatively (removing the lines that do not belong to the ts files)
 * 
 * if "toFile" is a vue file, it will offset the lines positively (adding the lines that do not belong to the ts files)
 */
function getLineAndChar(mapping: MappingInfo, lineAndChar: tsLib.LineAndCharacter) {
    let positive: boolean;
    let info: Info;
    if (isVueFile(mapping.from)) {
        ensureLines(mapping.from);
        info = getFile(mapping.from);
        positive = false;
    } else {
        info = getFile(mapping.to);
        ensureLines(mapping.to);
        positive = true;
    }

    if (positive) {
        return {
            line: lineAndChar.line + info.startLine!,
            character: lineAndChar.character
        }
    }
    return {
        line: lineAndChar.line - info.startLine!,
        character: lineAndChar.character
    }
}
/**
 * @interal
 * ensures that the file has its lines calculates
 */
function ensureLines(fileName: string) {
    const info = getFile(fileName);
    if (info && !info.lines) {
        info.lines = info.content.split(/\r?\n/).reduce((prev, cur, index) => {
            prev.push(cur.length + prev[index] + newLineLength);
            return prev;
        }, [0]);
        let startLine = info.lines.findIndex(greaterThan, info.start);
        startLine = (startLine === -1 ? info.lines.length : startLine) - 1;
        info.startLine = startLine;
    }
}
/**
 * returns whether the position or text range falls into the file
 */
function outOfBounds(fileName: string, posOrText: number | tsLib.TextRange) {
    const { start, end } = getFile(fileName);
    const diff = end - start;
    if (typeof posOrText === 'object') {
        return checkBounds(diff, posOrText.end) || checkBounds(diff, posOrText.pos);
    }

    return checkBounds(diff, posOrText);
}
/**
 * returns the content of the file
 */
function getContent(fileName: string) {
    return getFile(fileName).content;
}

/**
 * Calculates the position for a given pair of files
 * 
 * if "fromFile" is a vue file, it will position negatively (removing chars that do not belong to the ts files)
 * 
 * if "toFile" is a vue file, it will position positively (adding chars that do not belong to the ts files)
 */
function calculatePosition(info: MappingInfo, position: number) {
    if (isVueFile(info.from)) {
        return position - getStart(info.from);
    }

    return getStart(info.to) + position;
}
/**
 * return whether the file is a vue file or not
 */
function isVueFile(fileName: string) {
    return fileName.endsWith(vueExt);
}
/**
 * @interal
 * Check the cache for a partical file
 */
function hasFile(fileName: string): boolean {
    return !!files[fileName.toLowerCase()];
}
/**
 * @interal
 * Delete from the cache a partical file
 */
function deleteFile(fileName: string): boolean {
    return delete files[fileName.toLowerCase()];
}
/**
 * @interal
 * Set the cache content for a partical file
 */
function setFile(fileName: string, value: TsInfo | VueInfo): TsInfo | VueInfo {
    return files[fileName.toLowerCase()] = value;
}
/**
 * @interal
 * Gets the cache for a partical file
 */
function getFile(fileName: string): TsInfo | VueInfo {
    return files[fileName.toLowerCase()];
}



interface Info {
    start: number;
    end: number;
    content: string;
    startLine: number | null;
    lines: number[] | null;
}

class TsInfo implements Info {
    start: number;
    end: number;
    content: string;
    startLine: number | null;
    lines: number[] | null;
    originatingFile: VueInfo | undefined; // TODO should always exist
    constructor(content: string, parentFile?: VueInfo) {
        const parsedContent = parse(content);
        this.originatingFile = parentFile;
        this.start = parsedContent.start;
        this.end = parsedContent.end;
        this.content = parsedContent.content;
        this.startLine = null;
        this.lines = null;
    }
};

class VueInfo implements Info {
    start: number;
    end: number;
    content: string;
    startLine: number | null;
    lines: number[] | null;
    originatedFile: TsInfo | undefined;
    constructor(content: string, child?: TsInfo) {
        this.start = 0;
        this.end = content.length;
        this.content = content;
        this.startLine = null;
        this.lines = null;
        this.originatedFile = child;
    }
};

function greaterThan(this: number, val: number) {
    return this < val;
}
function checkBounds(diff: number, val: number) {
    return val < 0 || val >= diff;
}




function sliceTextChange(content: string, change: tsLib.TextChange) {
    return `${content.slice(0, change.span.start)}${change.newText}${content.slice(0, change.span.start + change.span.length)}`;
}
