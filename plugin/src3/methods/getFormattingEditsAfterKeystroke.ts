import { FormatCodeOptions, FormatCodeSettings, LanguageService, TextChange } from "typescript/lib/tsserverlibrary";
import { UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getFormattingEditsAfterKeystrokeFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outTextChange }: Mappers
): LanguageService['getFormattingEditsAfterKeystroke'] {
    return function (fileName: string, position: number, key: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[] {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getFormattingEditsAfterKeystroke(newFileName, newPosition, key, options);
            if (result.length) {
                return result.map(outTextChange, fileName);
            }

            return result;
        }

        return lang.getFormattingEditsAfterKeystroke(fileName, position, key, options);
    }
}





