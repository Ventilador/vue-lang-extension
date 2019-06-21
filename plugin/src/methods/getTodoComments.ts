import { LanguageService, TodoCommentDescriptor, TodoComment } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getTodoCommentsFactory
    (lang: LanguageService,
        { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
        { outTodoComment }: Mappers): LanguageService['getTodoComments'] {
    return function (fileName: string, descriptors: TodoCommentDescriptor[]): TodoComment[] {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getTodoComments(toTsPath(fileName), descriptors);
            if (result.length) {
                return result.map(outTodoComment, fileName);
            }
            return result;
        }

        return lang.getTodoComments(fileName, descriptors);
    }
}
