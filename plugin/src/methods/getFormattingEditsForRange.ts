import { LanguageService, FormatCodeOptions, FormatCodeSettings, TextChange } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getFormattingEditsForRangeFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition, getEnd }: Utils,
    { outTextChange }: Mappers
): LanguageService['getFormattingEditsForRange'] {
    return function (fileName: string, start: number, end: number, options: FormatCodeOptions | FormatCodeSettings): TextChange[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            let result: TextChange[];
            const newStart = Math.max(calculatePosition(fileName, start, false), 0);
            const newEnd = Math.min(calculatePosition(fileName, end, false), getEnd(fileName));
            result = lang.getFormattingEditsForRange(newFileName, newStart, newEnd, options);
            
            if (result.length) {
                result = result.map(outTextChange, fileName);
            }

            return result;
        }

        return lang.getFormattingEditsForRange(fileName, start, end, options);
    }
}
