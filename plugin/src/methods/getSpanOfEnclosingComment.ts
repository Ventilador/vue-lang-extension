import { LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSpanOfEnclosingCommentFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outTextSpan }: Mappers
): LanguageService['getSpanOfEnclosingComment'] {
    return function (fileName: string, position: number, onlyMultiLine: boolean): TextSpan | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getSpanOfEnclosingComment(newFileName, newPosition, onlyMultiLine);
            if (result) {
                debugger;
                return outTextSpan(fileName, result);
            }
            return result;
        }

        return lang.getSpanOfEnclosingComment(fileName, position, onlyMultiLine);
    }
}
