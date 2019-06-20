import { server, ScriptKind } from "typescript/lib/tsserverlibrary";
import { createServerHost } from "./serverHost";
import { parse } from "./parse";
type Info = {
    version: string;
    offset: number;
    content: string;
}
export type Utils = {
    synchronize: (fileName: string) => void;
    toTsPath: (fileName: string) => string;
    fromTsPath: (fileName: string) => string;
    isVueFile: (fileName: string) => boolean;
    wasVueFile: (fileName: string) => boolean;
    calculatePosition: (fileName: string, position: number, positive?: boolean) => number;
}

export function createUtils({ languageServiceHost, serverHost: originalHost, project }: server.PluginCreateInfo): Utils {
    const vueFiles: Record<string, Info> = Object.create(null);
    const utils: Utils = { synchronize, toTsPath, isVueFile, wasVueFile, fromTsPath, calculatePosition };
    const serverHost = createServerHost(originalHost, utils);
    return utils;

    function calculatePosition(fileName: string, position: number, positive: boolean = true) {
        const info = vueFiles[fileName];
        if (positive) {
            return info.offset + position;
        } else {
            return position - info.offset;
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
        const info = synchronizeVue(fileName);
    }


    function synchronizeVue(fileName: string) {
        const originalFileVersion = languageServiceHost.getScriptVersion(fileName);
        if (!vueFiles[fileName]) {
            vueFiles[fileName] = { version: '', offset: 0, content: '' };
        }
        if (vueFiles[fileName].version !== originalFileVersion) {
            const content = updateContent(fileName);
            updateProject(fileName, content);
            vueFiles[fileName].version = originalFileVersion;
        }
    }

    function updateContent(fileName: string) {
        const originalSnapshot = project.getScriptSnapshot(fileName);
        if (!originalSnapshot) {
            return '';
        }
        const parsedContent = parse(originalSnapshot.getText(0, originalSnapshot.getLength()));
        vueFiles[fileName].content = parsedContent.content;
        vueFiles[fileName].offset = parsedContent.offset;
        return parsedContent.content;
    }


    function updateProject(fileName: string, content: string) {
        const originalInfo = project.getScriptInfo(fileName);
        if (!originalInfo) {
            return;
        }
        fileName = toTsPath(fileName);
        const fileProject = originalInfo.getDefaultProject();
        const info = fileProject.getScriptInfo(fileName);
        if (info) {
            info.editContent(0, info.getSnapshot().getLength(), content);
        } else {
            const originalHost = (fileProject.projectService as any).host;
            (fileProject.projectService as any).host = serverHost;
            fileProject.projectService.openClientFile(fileName, content, ScriptKind.TS, originalInfo.getDefaultProject().getCurrentDirectory());
            (fileProject.projectService as any).host = originalHost;
        }
    }
}
