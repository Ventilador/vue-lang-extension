import { LanguageService, FormatCodeOptions, FormatCodeSettings, TextChange } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getFormattingEditsForRangeFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outTextChange }: Mappers
): LanguageService['getFormattingEditsForRange'] {
    return function (fileName: string, start: number, end: number, options: FormatCodeOptions | FormatCodeSettings): TextChange[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newStart = calculatePosition(fileName, start, false);
            const newEnd = calculatePosition(fileName, end, false);
            const result = lang.getFormattingEditsForRange(newFileName, newStart, newEnd, options);
            if (result.length) {
                debugger;
                return result.map(outTextChange, fileName);
            }
        }

        return lang.getFormattingEditsForRange(fileName, start, end, options);
    }
}
