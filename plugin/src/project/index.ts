import { server, ScriptKind } from "typescript/lib/tsserverlibrary";
import { applyChangesInOpenFilesFactory } from "./applyChangesInOpenFiles";
import { Mappers } from "../transformers";
import { Utils } from "../utils";
const patched = Symbol('patched');
export function patchProject(service: server.ProjectService, mappers: Mappers, utils: Utils): void;
export function patchProject(service: any, mappers: Mappers, utils: Utils): void {
    const { shouldRemap } = utils;
    if (needsPatching(service.applyChangesInOpenFiles)) {
        const options = Object.assign({ shouldAddSingleFile, addFiles, needsMoreFiles }, utils);
        patch(service, 'applyChangesInOpenFiles', applyChangesInOpenFilesFactory(service.applyChangesInOpenFiles, options, mappers));
    }
    wrapWithDebugger(service, 'openExternalProject');
    wrapWithDebugger(service, 'openExternalProjects');
    wrapWithDebugger(service, 'synchronizeProjectList' as any);
    wrapWithDebugger(service, 'openClientFileWithNormalizedPath');
    wrapWithDebugger(service, 'closeClientFile');
    wrapWithDebugger(service, 'reloadProjects');


    function needsMoreFiles(fileName: string) {
        return shouldRemap(fileName);
    }


    function shouldAddSingleFile(fileName: string) {
        return !shouldRemap(fileName);
    }
}
function patch(service: any, method: string, wrapper: any) {
    wrapper[patched] = true;
    service[method] = wrapper;
}

function addFiles(fileAdder: (fileName: string, kind?: ScriptKind.TS) => void, originalFileName: string) {
    fileAdder(originalFileName, ScriptKind.TS);
}

function needsPatching(method: any) {
    return !method[patched];
}

function wrapWithDebugger(service: server.ProjectService, method: keyof server.ProjectService) {
    const orig = service[method] as any;
    if (!needsPatching(orig)) {
        return orig;
    }
    return patch(service, method, function (this: server.ProjectService) {
        debugger;
        void method;
        return orig.apply(this, arguments);
    });
}
