import { FileWatcherCallback, FileWatcher, ScriptKind } from "typescript/lib/tsserverlibrary";
import { Utils } from "./utils";
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

export function patchFsLikeMethods(original: PartialFs, utils: Utils) {
    if (isPatched(original)) {
        return original;
    }
    const result: PartialFs = {};
    let mod = false;
    if (original.realpath) {
        mod = true;
        result.realpath = createRealPath(utils, original.realpath);
    }
    if (original.readDirectory) {
        mod = true;
        result.readDirectory = createReadDirecory(utils, original.readDirectory);
    }
    if (original.getModifiedTime) {
        mod = true;
        result.getModifiedTime = createGetModifiedTime(utils, original.getModifiedTime);
    }
    if (original.getFileSize) {
        mod = true;
        result.getFileSize = createGetFileSize(utils, original.getFileSize);
    }
    if (original.readFile) {
        mod = true;
        result.readFile = createReadFile(utils, original.readFile);
    }
    if (original.fileExists) {
        mod = true;
        result.fileExists = createFileExists(utils, original.fileExists);
    }
    if (original.watchFile) {
        mod = true;
        result.watchFile = createWatchFile(utils, original.watchFile);
    }
    if (mod) {
        Object.assign(original, result);
    }
    patch(original);
    return original;
}

function createWatchFile({ originatingFileName }: Utils, fn: WatchFile): WatchFile {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function watchFile(this: PartialFs, path: string, cb: FileWatcherCallback) {
        return fn.call(this, originatingFileName(path), cb);
    });
}
function createFileExists({ originatingFileName }: Utils, fn: FileExists): FileExists {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function fileExists(this: PartialFs, path: string) {
        return fn.call(this, originatingFileName(path));
    });
}

function createReadFile({ shouldRemap, open }: Utils, fn: ReadFile): ReadFile {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function readFile(this: PartialFs, path: string, encoding?: string) {
        if (shouldRemap(path)) {
            return open(path, fn.call(this, path, encoding) || '', ScriptKind.Unknown);
        }

        return fn.call(this, path, encoding);
    });
}


function createGetFileSize({ shouldRemap }: Utils, fn: GetFileSize): GetFileSize {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function getFileSize(this: PartialFs, path: string) {
        if (shouldRemap(path)) {
            debugger;
        }
        return fn.call(this, path);
    });
}

function createGetModifiedTime({ originatingFileName }: Utils, fn: GetModifiedTime): GetModifiedTime {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function getModifiedTime(this: PartialFs, path: string) {
        return fn.call(this, originatingFileName(path));
    });
}

function createReadDirecory({ originatedFilesNames }: Utils, fn: ReadDirectory): ReadDirectory {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function readDirectory(this: PartialFs, path: string, extensions?: readonly string[], exclude?: readonly string[], include?: readonly string[], depth?: number): string[] {
        const prev: string[] = [];
        fn.call(this, path, extensions, exclude, include, depth)
            .forEach(dirReducer, prev);
        return prev;
    });
    function dirReducer(this: string[], item: string) {
        originatedFilesNames(pushTo, item, this);
    }
}
function pushTo(this: string[], fileName: string) {
    this.push(fileName);
}

function createRealPath({ originatingFileName }: Utils, fn: RealPath): RealPath {
    if (isPatched(fn)) {
        return fn;
    }
    return patch(function realpath(this: PartialFs, fileName: string) {
        return fn.call(this, originatingFileName(fileName));
    });
}
const patched = Symbol('patched');
function isPatched(val: any): boolean {
    return !!val[patched];
}
function patch<T>(val: T): T {
    (val as any)[patched] = true;
    return val;
}
