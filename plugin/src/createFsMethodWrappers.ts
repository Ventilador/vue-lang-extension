import { FileWatcherCallback, FileWatcher } from "typescript/lib/tsserverlibrary";
import { Utils } from "./cache";
export type WatchFile = (path: string, cb: FileWatcherCallback) => FileWatcher;
export type FileExists = (path: string) => boolean;
export type ReadFile = (path: string, encoding?: string) => string | undefined;
export type GetFileSize = (path: string) => number;
export type GetModifiedTime = (path: string) => Date | undefined;
export type ReadDirectory = (path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number) => string[];
export type RealPath = (fileName: string) => string;
export type FsToWrap = {
    readFile: ReadFile;
    fileExists: FileExists;
    getFileSize: GetFileSize;
    getModifiedTime: GetModifiedTime;
    readDirectory: ReadDirectory;
    realpath: RealPath;
    watchFile: WatchFile;
}
export type PartialFs = Partial<FsToWrap>;

export function wrapFsMethods(original: PartialFs, utils: Utils) {
    const result: PartialFs = {};
    let mod = false;
    if (original.realpath) {
        mod = true;
        result.realpath = createRealPath(original, utils, original.realpath);
    }
    if (original.readDirectory) {
        mod = true;
        result.readDirectory = createReadDirecory(original, utils, original.readDirectory);
    }
    if (original.getModifiedTime) {
        mod = true;
        result.getModifiedTime = createGetModifiedTime(original, utils, original.getModifiedTime);
    }
    if (original.getFileSize) {
        mod = true;
        result.getFileSize = createGetFileSize(original, utils, original.getFileSize);
    }
    if (original.readFile) {
        mod = true;
        result.readFile = createReadFile(original, utils, original.readFile);
    }
    if (original.fileExists) {
        mod = true;
        result.fileExists = createFileExists(original, utils, original.fileExists);
    }
    if (original.watchFile) {
        mod = true;
        result.watchFile = createWatchFile(original, utils, original.watchFile);
    }
    if (mod) {
        Object.assign(original, result);
    }
    return result;
}

function createWatchFile(original: PartialFs, { fromTsPath, wasVueFile }: Utils, fn: WatchFile): WatchFile {
    return function (path: string, cb: FileWatcherCallback) {
        if (wasVueFile(path)) {
            return fn.call(original, fromTsPath(path), cb);
        }

        return fn.call(original, path, cb);
    }
}
function createFileExists(original: PartialFs, { fromTsPath, wasVueFile }: Utils, fn: FileExists): FileExists {
    return function fileExists(path: string) {
        if (wasVueFile(path)) {
            return fn.call(original, fromTsPath(path));
        }

        return fn.call(original, path);
    }
}

function createReadFile(original: PartialFs, { fromTsPath, wasVueFile, synchronize, getTsContent }: Utils, fn: ReadFile): ReadFile {
    return function readFile(path: string, encoding?: string) {
        if (wasVueFile(path)) {
            path = fromTsPath(path);
            synchronize(path);
            return getTsContent(path);
        }

        return fn.call(original, path, encoding);
    }
}


function createGetFileSize(original: PartialFs, { isVueFile, wasVueFile }: Utils, fn: GetFileSize): GetFileSize {
    return function getFileSize(path: string) {
        if (isVueFile(path)) {
            return 0;
        }

        if (wasVueFile(path)) {
            debugger;
        }
        return fn.call(original, path);
    }
}

function createGetModifiedTime(original: PartialFs, { wasVueFile }: Utils, fn: GetModifiedTime): GetModifiedTime {
    return function getModifiedTime(path: string) {
        if (wasVueFile(path)) {
            debugger;
        }
        return fn.call(original, path);
    }
}

function createReadDirecory(original: PartialFs, { isVueFile, toTsPath }: Utils, fn: ReadDirectory): ReadDirectory {
    return function readDirectory(path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[] {
        return fn.call(original, path, extensions, exclude, include, depth)
            .reduce(dirReducer, [] as string[]);
    }

    function dirReducer(prev: string[], item: string) {
        if (isVueFile(item)) {
            prev.push(toTsPath(item));
        }
        prev.push(item);
        return prev;
    }

}

function createRealPath(original: PartialFs, { wasVueFile, fromTsPath }: Utils, fn: RealPath): RealPath {
    return function realpath(fileName: string) {
        if (wasVueFile(fileName)) {
            return fn.call(original, fromTsPath(fileName)) + '.ts';
        }

        return fn.call(original, fileName);
    }
}
