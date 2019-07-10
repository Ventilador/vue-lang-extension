import { server } from "typescript/lib/tsserverlibrary";
import { Utils } from "./cache";
export function createServerHost(original: server.ServerHost, { isVueFile, toTsPath, wasVueFile, fromTsPath, synchronize, getTsContent }: Utils) {
    const copy = {
        realpath: original.realpath!,
        readDirectory: original.readDirectory!,
        getModifiedTime: original.getModifiedTime!,
        getFileSize: original.getFileSize,
        readFile: original.readFile,
        fileExists: original.fileExists,
    };

    return Object.assign(original as server.ServerHost, {
        readFile,
        fileExists,
        getFileSize,
        getModifiedTime,
        readDirectory,
        realpath,
        getFileContent: copy.readFile
    });

    function realpath(fileName: string) {
        if (wasVueFile(fileName)) {
            return copy.realpath!(fromTsPath(fileName)) + '.ts';
        }

        return copy.realpath!(fileName);
    }

    function readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[] {
        return copy.readDirectory(path, extensions, exclude, include, depth)
            .reduce(dirReducer, [] as string[]);
    }

    function dirReducer(prev: string[], item: string) {
        if (isVueFile(item)) {
            prev.push(toTsPath(item));
        }
        prev.push(item);
        return prev;
    }

    function getModifiedTime(path: string) {
        if (wasVueFile(path)) {
            debugger;
        }
        return copy.getModifiedTime!(path);
    }

    function getFileSize(path: string) {
        if (isVueFile(path)) {
            return 0;
        }

        if (wasVueFile(path)) {
            debugger;
        }
        return copy.getFileSize!(path);
    }

    function fileExists(path: string) {
        if (wasVueFile(path)) {
            return copy.fileExists(fromTsPath(path));
        }

        return copy.fileExists(path);
    }

    function readFile(path: string, encoding?: string) {
        if (wasVueFile(path)) {
            path = fromTsPath(path);
            synchronize(path);
            return getTsContent(path);
        }

        return copy.readFile(path, encoding);
    }
}
