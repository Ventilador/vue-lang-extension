import { server, ScriptKind, TextChange, SyntaxKind } from "typescript/lib/tsserverlibrary";
import { Mappers } from './../transformers';
import { Utils } from "../utils";
export type ApplyChangesInOpenFiles = (this: server.ProjectService, openFiles: Iterator<OpenFileArguments> | undefined, changedFiles?: Iterator<ChangeFileArguments>, closedFiles?: string[]) => any;
export type ApplyChangesInOpenFilesFactoryOptions = {
    needsMoreFiles: (fileName: string) => boolean;
    addFiles: (fileAdder: (fileName: string, kind?: ScriptKind.TS) => void, originalFileName: string) => void;
    shouldAddSingleFile: (fileName: string) => boolean;
} & Pick<Utils, 'open' | 'close' | 'update' | 'has'>
export function applyChangesInOpenFilesFactory(
    orig: ApplyChangesInOpenFiles,
    { needsMoreFiles, addFiles, shouldAddSingleFile, open, close, update, has }: ApplyChangesInOpenFilesFactoryOptions,
    { inTextChange }: Mappers

): ApplyChangesInOpenFiles {
    return function applyChangesInOpenFiles(this: server.ProjectService, openFiles: Iterator<OpenFileArguments> | undefined, changedFiles?: Iterator<ChangeFileArguments>, closedFiles?: string[]) {
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
        openFile(prev, openedFile.fileName, openedFile, ScriptKind.Unknown);
        if (needsMoreFiles(openedFile.fileName)) {
            addFiles((file, kind) => openFile(prev, file, openedFile, kind || ScriptKind.TS), openedFile.fileName)
        }
        return prev;
    }

    function openFile(prev: OpenFileArguments[], fileName: string, openedFile: OpenFileArguments, kind: ScriptKind) {
        prev.push({
            content: open(fileName, openedFile.content, kind),
            fileName: openedFile.fileName,
            hasMixedContent: openedFile.hasMixedContent,
            projectRootPath: openedFile.projectRootPath,
            scriptKind: kind
        });
    }

    function reduceClosedFiles(prev: string[], cur: string): string[] {
        if (shouldAddSingleFile(cur)) {
            close(cur);
            prev.push(cur);
        }
        if (needsMoreFiles(cur)) {
            addFiles(function (fileName: string) {
                close(fileName);
                prev.push(fileName);
            }, cur);
        }
        return prev;
    }

    function reduceChangedFiles(prev: ChangeFileArguments[], changedFile: ChangeFileArguments): ChangeFileArguments[] {
        if (shouldAddSingleFile(changedFile.fileName)) {
            addChange(prev, changedFile.fileName, changedFile.changes);
        }
        if (needsMoreFiles(changedFile.fileName)) {
            addFiles((name: string) => addChange(prev, name, changedFile.changes), changedFile.fileName);
        }

        return prev;
    }
    function addChange(prev: ChangeFileArguments[], fileName: string, changes: Iterator<TextChange>) {
        prev.push({
            fileName: fileName,
            changes: mapIterator(changes, function (cur) {
                const change = inTextChange(fileName, cur);
                update(fileName, change);
                return change;
            })
        });
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




export interface OpenFileArguments {
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