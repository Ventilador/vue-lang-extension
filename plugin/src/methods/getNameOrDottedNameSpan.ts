import { LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getNameOrDottedNameSpanFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outTextSpan }: Mappers
): LanguageService['getNameOrDottedNameSpan'] {
    return function (fileName: string, startPos: number, endPos: number): TextSpan | undefined {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newStart = calculatePosition(fileName, startPos, false);
            const newEnd = calculatePosition(fileName, endPos, false);
            const result = lang.getNameOrDottedNameSpan(newFileName, newStart, newEnd);
            if (result) {

                return outTextSpan(fileName, result);
            }
        }

        return lang.getNameOrDottedNameSpan(fileName, startPos, endPos);
    }
}
