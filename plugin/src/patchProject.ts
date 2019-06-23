import { server, ScriptKind, TextChange } from "typescript/lib/tsserverlibrary";
import { Utils } from "./cache";
import { Mappers } from "./transformers";
const patched = Symbol('patched');
export function patchProject(
    proj: server.Project,
    { isVueFile, toTsPath }: Utils,
    { inTextChange }: Mappers): void {
    if (isPatched(proj.projectService)) {
        return;
    }

    const orig = (proj.projectService as any).applyChangesInOpenFiles;
    patch(proj.projectService, applyChangesInOpenFiles);
    debugger;
    return;

    function applyChangesInOpenFiles(this: server.ProjectService, openFiles: Iterator<OpenFileArguments> | undefined, changedFiles?: Iterator<ChangeFileArguments>, closedFiles?: string[]) {
        if (openFiles) {
            openFiles = reduceIterator(openFiles, reduceOpenFiles);
        }

        if (changedFiles) {
            changedFiles = reduceIterator(changedFiles, reduceChangedFiles);
        }

        if (closedFiles) {
            closedFiles = reduceArray(closedFiles, reduceClosedFiles);
        }

        return orig.call(this, openFiles, changedFiles, closedFiles);
    }

    function reduceOpenFiles(prev: OpenFileArguments[], openedFile: OpenFileArguments): OpenFileArguments[] {
        prev.push(openedFile);
        if (isVueFile(openedFile.fileName)) {
            prev.push({
                fileName: toTsPath(openedFile.fileName),
                hasMixedContent: openedFile.hasMixedContent,
                projectRootPath: openedFile.projectRootPath,
                scriptKind: ScriptKind.TS
            });
        }
        return prev;
    }

    function reduceClosedFiles(prev: string[], cur: string): string[] {
        prev.push(cur);
        if (isVueFile(cur)) {
            prev.push(toTsPath(cur));
        }
        return prev;
    }

    function reduceChangedFiles(prev: ChangeFileArguments[], changedFile: ChangeFileArguments): ChangeFileArguments[] {
        prev.push(changedFile);
        if (isVueFile(changedFile.fileName)) {
            const newFileName = toTsPath(changedFile.fileName);
            prev.push({
                fileName: toTsPath(changedFile.fileName),
                changes: mapIterator(changedFile.changes, function (cur) {
                    return inTextChange(newFileName, cur);
                })
            });
        }

        return prev;
    }
}

function mapIterator<T, U>(iter: Iterator<T>, mapFn: (x: T) => U): Iterator<U> {
    return {
        next() {
            const iterRes = iter.next();
            return iterRes.done ? iterRes as any : { value: mapFn(iterRes.value), done: false };
        }
    };
}
function reduceIterator<T, U>(iterator: Iterator<T>, reducer: (prev: U[], val: T, index: number) => U[]): Iterator<U> {
    let prev: U[] = [];
    let index = 0;
    let doneIterating = false;
    return {
        next: function () {
            if (!doneIterating) {
                const { done, value } = iterator.next();
                if (done) {
                    doneIterating = true;
                } else if (!(prev = reducer(prev, value, index)) || !Array.isArray(prev)) {
                    throw new Error('Reducer didn\'t return an array');
                }
            }
            if (index === prev.length) {
                return {
                    done: true,
                    value: undefined as any
                }
            }

            return {
                done: false,
                value: prev[index++]
            }
        }
    };
}
function reduceArray<T, U>(arr: T[], reducer: (prev: U[], cur: T, index: number, arr: T[]) => U[]): U[] {
    if (arr.length) {
        return arr.reduce(reducer, []);
    }

    return arr as any;
}

function patch(projectService: any, val: any) {
    val[patched] = true;
    projectService.applyChangesInOpenFiles = val;
}

function isPatched(val: any) {
    return !!val.applyChangesInOpenFiles[patched];
}



interface OpenFileArguments {
    fileName: string;
    content?: string;
    scriptKind?: server.protocol.ScriptKindName | ScriptKind;
    hasMixedContent?: boolean;
    projectRootPath?: string;
}

interface ChangeFileArguments {
    fileName: string;
    changes: Iterator<TextChange>;
}
type MapIterator<T, U> = (iter: Iterator<T>, mapFn: (x: T) => U) => Iterator<U>;