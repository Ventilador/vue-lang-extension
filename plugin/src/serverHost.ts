import { server } from "typescript/lib/tsserverlibrary";
import { Utils } from "./cache";
export function createServerHost(original: server.ServerHost, { isVueFile, toTsPath, wasVueFile, fromTsPath }: Utils): server.ServerHost {
    return Object.assign(Object.create(original) as server.ServerHost, {
        readFile,
        deleteFile,
        fileExists,
        getFileSize,
        getModifiedTime,
        readDirectory,
        resolvePath,
        require,
        realpath
    });

    function realpath(fileName: string) {
        if (wasVueFile(fileName)) {
            return original.realpath!(fromTsPath(fileName)) + '.ts';
        }

        return original.realpath!(fileName);
    }

    function require(initialPath: string, moduleName: string): server.RequireResult {
        return original.require!(initialPath, moduleName);
    }

    function resolvePath(path: string) {
        return path;
    }

    function readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[] {
        return [];
    }

    function getModifiedTime(path: string) {
        return new Date;
    }

    function getFileSize(path: string) {
        return 0;
    }

    function fileExists(path: string) {
        return true;
    }

    function deleteFile(path: string) {

    }

    function readFile(path: string, encoding?: string) {
        if (path.endsWith('.vue')) {

        }

        return original.readFile(path, encoding);
    }
}
