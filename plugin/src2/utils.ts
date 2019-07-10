import { LineAndCharacter, TextRange, TextChange } from "typescript/lib/tsserverlibrary";
import * as tsLib from 'typescript/lib/tsserverlibrary';
import { parse } from "./parse";
import { readFileSync } from "fs";
import { OpenFileArguments } from "./project/applyChangesInOpenFiles";

export function createUtils(ts: typeof tsLib): Utils {
    if ((ts.sys as any)[patched]) {
        return (ts.sys as any)[patched]
    }
    return (ts.sys as any)[patched] = createUtilsInternal(ts);
}

export type Utils = {
    originatedFilesNames: (fileAdder: (fileName: string, kind?: tsLib.ScriptKind.TS) => void, originalFileName: string, thisArg?: any) => void;
    calculatePosition: (fileName: string, position: number, positive?: boolean) => number;
    shouldRemap: (fileName: string) => boolean;
    getLineAndChar: (fileName: string, lineAndChar: LineAndCharacter, positive?: boolean) => LineAndCharacter;
    getContent: (fileName: string) => string;
    originatingFileName: (fileName: string) => string;
    synchronizer: (project: tsLib.server.Project) => (file: string) => void;
    open: (fileName: string, content: string, kind: tsLib.ScriptKind) => string;
    getStart: (fileName: string, real?: boolean) => number;
    getEnd: (fileName: string, real?: boolean) => number;
    outOfBounds: (fileName: string, position: number | TextRange) => boolean;
    close: (fileName: string) => void;
    update: (fileName: string, changes: TextChange | Iterator<TextChange>) => void;
    has: (fileName: string) => boolean;
    // reload: (fileName: string, content: string) => string;
    addFiles: (fileAdder: (fileName: string) => void, originalFileName: string) => void;
};

function createUtilsInternal({ sys }: typeof tsLib): Utils;
function createUtilsInternal(info: any): Utils {
    const { sys, arrayIterator } = info as typeof tsLib & { arrayIterator: ArrayIterator<OpenFileArguments> }
    const newLine = sys.newLine.length;
    return {
        shouldRemap, getLineAndChar, addFiles,
        calculatePosition, getContent, outOfBounds,
        getStart, getEnd, open, close, update, has,
        originatedFilesNames, originatingFileName, synchronizer
    };

    function addFiles(fileAdder: (fileName: string, kind?: tsLib.ScriptKind.TS) => void, originalFileName: string) {
        fileAdder(originalFileName, tsLib.ScriptKind.TS);
        fileAdder(toTsFile(originalFileName), tsLib.ScriptKind.TS);
    }
    function synchronizer(project: tsLib.server.Project) {
        let fn = function (file: string) {
            debugger;
            if (!has(file)) {
                const info = project.getScriptInfo(file);
                if (info) {
                    const content = reload(toTsFile(file), info.getSnapshot().getText(0, info.getSnapshot().getLength()));
                    (project.projectService as any).applyChangesInOpenFiles(arrayIterator([{
                        fileName: toTsFile(file),
                        content: content,
                        hasMixedContent: false,
                        projectRootPath: project.getCurrentDirectory(),
                        scriptKind: tsLib.ScriptKind.TS
                    }]));
                }
            }
            fn = () => { };
        }
        return function (file: string) {
            fn(file);
        }
    }
    function toTsFile(fileName: string) {
        return fileName + '.temp.ts';
    }
    function originatingFileName(fileName: string) {
        return fileName;
    }
    function originatedFilesNames(fileAdder: (fileName: string, kind?: tsLib.ScriptKind.TS) => void, originalFileName: string, thisArg: any = null) {
        fileAdder.call(thisArg, originalFileName + '.ts', tsLib.ScriptKind.TS);
    }
    function has(fileName: string) {
        return !!vueFiles[fileName];
    }
    function applyTextChange(fileName: string, change: TextChange) {
        open(fileName, sliceTextChange(vueFiles[fileName].content, change));
    }
    function update(fileName: string, changes: TextChange | Iterator<TextChange>) {
        if (isIterator(changes)) {
            changes.next = tapIterator(changes, updateFromIterator, fileName);
        } else {
            applyTextChange(fileName, changes);
        }
    }
    function updateFromIterator(this: string, change: TextChange) {
        applyTextChange(this, change);
    }
    function open(fileName: string, content: string, kind: tsLib.ScriptKind) {
        if (kind === tsLib.ScriptKind.TS) {
            return (vueFiles[fileName] = Object.assign(parse(content), {
                lines: null,
                startLine: null,
                isOpen: true

            })).content;
        }
        return (vueFiles[fileName] = {
            content,
            end: content.length,
            isOpen: true,
            lines: null,
            startLine: null,
            start: 0
        }).content;
    }
    // function open(fileName: string, content: string = '') {
    //     if (vueFiles[fileName]) {
    //         debugger;
    //         log(`should not re open file "${fileName}"`);
    //     }
    //     return reload(fileName, content);
    // }
    function close(fileName: string) {
        if (!vueFiles[fileName]) {
            debugger;
            log(`should not re open file "${fileName}"`);
            return;
        }
        delete vueFiles[fileName];
    }
    function getStart(file: string, real?: boolean) {
        return real ? 0 : getVueFile(file).start;
    }
    function getEnd(file: string, real?: boolean) {
        return real ? getVueFile(file).originalContent.length : getVueFile(file).end;
    }
    function getLineAndChar(fileName: string, lineAndChar: LineAndCharacter, positive: boolean = true) {
        const info = getVueFile(fileName);
        if (!info.lines) {
            info.lines = info.originalContent.split(/\r?\n/).reduce((prev, cur, index) => {
                prev.push(cur.length + prev[index] + newLine);
                return prev;
            }, [0]);
            let startLine = info.lines.findIndex(greaterThan, info.start);
            startLine = (startLine === -1 ? info.lines.length : startLine) - 1;
            info.startLine = startLine;
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
    function outOfBounds(fileName: string, posOrText: number | TextRange) {
        const { start, end } = getVueFile(fileName);
        const diff = end - start;
        if (typeof posOrText === 'object') {
            return checkBounds(diff, posOrText.end) || checkBounds(diff, posOrText.pos);
        }

        return checkBounds(diff, posOrText);
    }
    function getContent(fileName: string) {
        return getVueFile(fileName).content;
    }
    function calculatePosition(fileName: string, position: number, positive: boolean = true) {
        const info = getVueFile(fileName);
        if (positive) {
            return info.start + position;
        } else {
            return position - info.start;
        }
    }


    function shouldRemap(fileName: string) {
        return fileName.endsWith(vueExt);
    }

    function getVueFile(fileName: string) {
        if (vueFiles[fileName]) {
            return vueFiles[fileName];
        }


        open(fileName, readFileSync(fileName, 'utf8'), 0);
        return vueFiles[fileName];
    }
}

type Info = {
    start: number;
    end: number;
    content: string;
    startLine: number | null;
    lines: number[] | null;
    isOpen: boolean;
}

type TsInfo = {
    originatedFile: VueInfo;
} & Info;

type VueInfo = {
    originatingFile: TsInfo;
} & Info;

function greaterThan(this: number, val: number) {
    return this < val;
}
function checkBounds(diff: number, val: number) {
    return val < 0 || val >= diff;
}
const vueExt = '.vue';
const vueFiles: Record<string, Info> = Object.create(null);
function isIterator(val: any): val is Iterator<any> {
    return val && typeof val.next === 'function';
}
function tapIterator<T>(iter: Iterator<any>, mapper: (this: T, val: any) => void, thisArgs: T = null as any): () => IteratorResult<any> {
    return function () {
        const cur = iter.next();
        if (!cur.done) {
            mapper.call(thisArgs, cur.value);
        }
        return cur;
    }
}
const patched = Symbol('patched');

type ArrayIterator<T> = (array: ReadonlyArray<T>) => Iterator<T>;


function sliceTextChange(content: string, change: TextChange) {
    return `${content.slice(0, change.span.start)}${change.newText}${content.slice(0, change.span.start + change.span.length)}`;
}



