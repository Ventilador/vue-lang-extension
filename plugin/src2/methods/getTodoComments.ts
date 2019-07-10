import { LanguageService, TodoComment, TodoCommentDescriptor } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
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
