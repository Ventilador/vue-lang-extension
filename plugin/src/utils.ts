import { LineAndCharacter, TextRange, TextChange } from "typescript/lib/tsserverlibrary";
import * as tsLib from 'typescript/lib/tsserverlibrary';
import { parse } from "./parse";
import { readFileSync } from "fs";
export type Utils = {
    originatedFilesNames: (fileAdder: (fileName: string, kind?: tsLib.ScriptKind.TS) => void, originalFileName: string, thisArg?: any) => void;
    calculatePosition: (fileName: string, position: number, positive?: boolean) => number;
    shouldRemap: (fileName: string) => boolean;
    getLineAndChar: (fileName: string, lineAndChar: LineAndCharacter, positive?: boolean) => LineAndCharacter;
    getContent: (fileName: string) => string;
    originatingFileName: (fileName: string) => string;

    open: (fileName: string, content?: string) => string;
    getStart: (fileName: string, real?: boolean) => number;
    getEnd: (fileName: string, real?: boolean) => number;
    outOfBounds: (fileName: string, position: number | TextRange) => boolean;
    close: (fileName: string) => void;
    update: (fileName: string, changes: TextChange | Iterator<TextChange>) => void;
    has: (fileName: string) => boolean;
    reload: (fileName: string, content: string) => string;
};
type Info = {
    start: number;
    end: number;
    content: string;
    originalContent: string;
    startLine: number | null;
    lines: number[] | null;
}

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
export function createUtils({ sys }: typeof tsLib): Utils {
    if ((sys as any)[patched]) {
        return (sys as any)[patched]
    }
    return (sys as any)[patched] = createUtilsInternal(sys);
}
function createUtilsInternal(sys: typeof tsLib.sys): Utils {
    const utils: Utils = (sys as any)[patched] = {
        shouldRemap, getLineAndChar,
        calculatePosition, getContent, outOfBounds,
        getStart, getEnd, open, close, update, has, reload,
        originatedFilesNames, originatingFileName
    };

    const newLine = sys.newLine.length;
    return utils;
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
        reload(fileName, sliceTextChange(vueFiles[fileName].content, change));
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
    function reload(fileName: string, content: string) {
        return (vueFiles[fileName] = Object.assign(parse(content), {
            lines: null,
            startLine: null
        })).content;
    }
    function open(fileName: string, content: string = '') {
        if (vueFiles[fileName]) {
            debugger;
            log(`should not re open file "${fileName}"`);
        }
        return reload(fileName, content);
    }
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
            return position;
        }
    }


    function shouldRemap(fileName: string) {
        return fileName.endsWith(vueExt);
    }

    function getVueFile(fileName: string) {
        if (vueFiles[fileName]) {
            return vueFiles[fileName];
        }


        reload(fileName, readFileSync(fileName, 'utf8'));
        return vueFiles[fileName];
    }
}

function sliceTextChange(content: string, change: TextChange) {
    return `${content.slice(0, change.span.start)}${change.newText}${content.slice(0, change.span.start + change.span.length)}`;
}



