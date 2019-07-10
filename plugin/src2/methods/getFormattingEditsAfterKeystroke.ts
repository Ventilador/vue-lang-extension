import { FormatCodeOptions, FormatCodeSettings, LanguageService, TextChange } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getFormattingEditsAfterKeystrokeFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outTextChange }: Mappers
): LanguageService['getFormattingEditsAfterKeystroke'] {
    return function (fileName: string, position: number, key: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[] {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getFormattingEditsAfterKeystroke(newFileName, newPosition, key, options);
            if (result.length) {
                return result.map(outTextChange, fileName);
            }

            return result;
        }

        return lang.getFormattingEditsAfterKeystroke(fileName, position, key, options);
    }
}
