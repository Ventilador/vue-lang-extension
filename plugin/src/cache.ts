import { server, ScriptKind, isArrowFunction, TextRange, LineAndCharacter, IScriptSnapshot } from "typescript/lib/tsserverlibrary";
import { createServerHost } from "./serverHost";
import { parse } from "./parse";
import { readFileSync } from "fs";
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
const vueFiles: Record<string, Info> = Object.create(null);
export function createUtils({ serverHost, project }: Partial<server.PluginCreateInfo>): Utils {
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
        return fileName.slice(0, -'.ts'.length)
    }

    function wasVueFile(fileName: string) {
        return fileName.endsWith('.vue.ts');
    }

    function isVueFile(fileName: string) {
        return fileName.endsWith('.vue');
    }

    function toTsPath(fileName: string): string {
        return fileName + '.ts';
    }

    function synchronize(fileName: string) {
        const info = project!.getScriptInfo(fileName);
        const originalFileVersion = info ? info.getLatestVersion() : 'from-disk';
        if (!vueFiles[fileName]) {
            vueFiles[fileName] = { version: '', start: 0, content: '', end: 0, lines: null, originalContent: '', startLine: null };
        }
        if (vueFiles[fileName].version !== originalFileVersion) {
            updateContents(fileName, originalFileVersion);
            updateProject(fileName);
        }
    }

    function updateContents(fileName: string, originalFileVersion: string) {
        const originalSnapshot = project!.getScriptSnapshot(fileName);
        const orig = getContent(fileName, originalSnapshot);
        vueFiles[fileName].version = originalFileVersion;
        const parsedContent = parse(orig);
        vueFiles[fileName].originalContent = orig.toString();
        vueFiles[fileName].start = parsedContent.start;
        vueFiles[fileName].end = parsedContent.end;
        return vueFiles[fileName].content = parsedContent.parsed;
    }

    function getContent(fileName: string, snap: IScriptSnapshot | undefined): string {
        if (snap) {
            return snap.getText(0, snap.getLength());
        }

        return readFileSync(fileName, 'utf8')!;
    }


    function updateProject(fileName: string) {
        const content = vueFiles[fileName].content;
        const info = project!.getScriptInfo(toTsPath(fileName));
        if (info) {
            if (info.isScriptOpen()) {
                info.reloadFromFile();
            } else {
                info.open(content);
            }
        } else {
            const originalInfo = project!.getScriptInfo(fileName);
            // if (!originalInfo) {
            //     debugger;
            //     return;
            // }
            const fileProject = originalInfo ? originalInfo.getDefaultProject() : project!;
            fileProject.addMissingFileRoot(server.asNormalizedPath(toTsPath(fileName)));
            fileProject.markAsDirty();
            fileProject.updateGraph();
            // const originalHost = (fileProject.projectService as any).host;
            // (fileProject.projectService as any).host = serverHost;
            // fileProject.projectService.openClientFile(toTsPath(fileName), content, ScriptKind.TS, fileProject.getCurrentDirectory());
            // (fileProject.projectService as any).host = originalHost;
        }
    }
}
