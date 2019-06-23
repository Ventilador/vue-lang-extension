import { readFileSync } from "fs";
import { IScriptSnapshot, LineAndCharacter, server as TsServer, TextRange, ScriptKind, server } from "typescript/lib/tsserverlibrary";
import { parse } from "./parse";
import { getTextChange } from "./textDiff";
type Info = {
    version: string;
    start: number;
    end: number;
    content: string;
    originalContent: string;
    startLine: number | null;
    lines: number[] | null;
}
export type Utils = {
    getTsContent: (fileName: string) => string;
    synchronize: (fileName: string) => void;
    toTsPath: (fileName: string) => string;
    fromTsPath: (fileName: string) => string;
    isVueFile: (fileName: string) => boolean;
    wasVueFile: (fileName: string) => boolean;
    calculatePosition: (fileName: string, position: number, positive?: boolean) => number;
    getStart: (fileName: string, real?: boolean) => number;
    getEnd: (fileName: string, real?: boolean) => number;
    outOfBounds: (fileName: string, position: number | TextRange) => boolean;
    getLineAndChar: (fileName: string, lineAndChar: LineAndCharacter) => LineAndCharacter;
}

function greaterThan(this: number, val: number) {
    return this < val;
}
function checkBounds(diff: number, val: number) {
    return val < 0 || val >= diff;
}
const tsExt = '.TEMP.ts';
const vueExt = '.vue';
const wasExt = vueExt + tsExt;
const vueFiles: Record<string, Info> = Object.create(null);
export function createUtils({ serverHost, project, languageServiceHost }: TsServer.PluginCreateInfo, server: typeof TsServer): Utils {
    const utils: Utils = {
        synchronize, toTsPath, isVueFile, wasVueFile, getLineAndChar,
        fromTsPath, calculatePosition, getTsContent, outOfBounds,
        getStart, getEnd
    };

    const newLine = serverHost!.newLine.length;
    return utils;
    function getStart(file: string, real?: boolean) { return real ? 0 : vueFiles[file].start }
    function getEnd(file: string, real?: boolean) { return real ? vueFiles[file].originalContent.length : vueFiles[file].end }
    function getLineAndChar(fileName: string, lineAndChar: LineAndCharacter) {
        const info = vueFiles[fileName];
        if (!info.lines) {
            info.lines = info.originalContent.split(/\r?\n/).reduce((prev, cur, index) => {
                prev.push(cur.length + prev[index] + newLine);
                return prev;
            }, [0]);
            let startLine = info.lines.findIndex(greaterThan, info.start);
            startLine = (startLine === -1 ? info.lines.length : startLine) - 1;
            info.startLine = startLine;
        }

        return {
            line: lineAndChar.line + info.startLine!,
            character: lineAndChar.character
        }
    }
    function outOfBounds(fileName: string, posOrText: number | TextRange) {
        const { start, end } = vueFiles[fileName];
        const diff = end - start;
        if (typeof posOrText === 'object') {
            return checkBounds(diff, posOrText.end) || checkBounds(diff, posOrText.pos);
        }

        return checkBounds(diff, posOrText);
    }
    function getTsContent(fileName: string) {
        return vueFiles[fileName].content;
    }
    function calculatePosition(fileName: string, position: number, positive: boolean = true) {
        const info = vueFiles[fileName];
        if (positive) {
            return info.start + position;
        } else {
            return position - info.start;
        }
    }

    function fromTsPath(fileName: string) {
        return fileName.slice(0, -tsExt.length)
    }

    function wasVueFile(fileName: string) {
        return fileName.endsWith(wasExt);
    }

    function isVueFile(fileName: string) {
        return fileName.endsWith(vueExt);
    }

    function toTsPath(fileName: string): string {
        return fileName + tsExt;
    }

    function synchronize(fileName: string) {
        const info = getVueScriptInfo(fileName);
        if (!info) {
            debugger;
            log(`Could not find info for file "${fileName}"`);
            return;
        }

        const originalFileVersion = info.getLatestVersion();
        const vueFile = getVueFile(fileName);

        if (vueFile.version !== originalFileVersion) {
            vueFile.version = originalFileVersion;
            const newContent = getContent(info);

            if (
                newContent.length === vueFile.originalContent.length &&
                // if the lengths are equal, give it a shot to see if text didn't change
                newContent === vueFile.originalContent
            ) {
                return;
            }

            vueFile.originalContent = newContent;
            const parsedContent = parse(newContent);
            const diff = getTextChange(vueFile.content, parsedContent.parsed);
            if (!diff) {
                return;
            }
            vueFile.start = parsedContent.start;
            vueFile.end = parsedContent.end;
            vueFile.content = vueFile.content.slice(diff.span.start) + diff.newText + vueFile.content.slice(diff.span.length);
            let created = false;
            const tsInfo = getOrCreateScriptInfo(toTsPath(fileName), function () {
                created = true;
                return vueFile.content;
            })
            if (created) {
                return;
            }

            tsInfo.editContent(diff.span.start, diff.span.start + diff.span.length, diff.newText);
        }
    }

    function getVueScriptInfo(fileName: string) {
        return getOrCreateScriptInfo(fileName, readFile);
    }

    function readFile(fileName: string) {
        return languageServiceHost.readFile!(fileName, 'utf8') || '';
    }

    function getOrCreateScriptInfo(fileName: string, content: ((val: string) => string) = String) {
        let info = project.getScriptInfo(fileName);
        if (info) {
            return info;
        }

        const path = server.asNormalizedPath(fileName);
        info = new server.ScriptInfo(serverHost, path, ScriptKind.Unknown, false, server.normalizedPathToPath(path, project.getCurrentDirectory(), (v) => v.toLowerCase()));
        info.open(content(fileName));
        info.close = interceptedClose;
        
        project.projectService.openFiles.set(fileName.toLowerCase(), server.asNormalizedPath(project.getCurrentDirectory()));
        project.addRoot(info);
        return info;
    }

    function interceptedClose(this: server.ScriptInfo) {
        debugger;
        return server.ScriptInfo.prototype.close.apply(this, arguments as any);
    }

    function getVueFile(fileName: string) {
        if (vueFiles[fileName]) {
            return vueFiles[fileName];
        }

        return vueFiles[fileName] = createEmptyVueFile();
    }


    function getContent(info: server.ScriptInfo): string {
        const snap = info.getSnapshot()
        if (snap) {
            return snap.getText(0, snap.getLength());
        }

        return readFileSync(info.fileName, 'utf8')!;
    }

}

function createEmptyVueFile() {
    return {
        version: '',
        start: 0,
        end: 0,
        content: '',
        originalContent: '',
        startLine: null,
        lines: null,
    };
}



