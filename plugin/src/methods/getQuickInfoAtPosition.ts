import { LanguageService, QuickInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getQuickInfoAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outQuickInfo }: Mappers
): LanguageService['getQuickInfoAtPosition'] {
    return function (fileName: string, position: number): QuickInfo | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getQuickInfoAtPosition(newFileName, newPosition);
            if (result) {
                return outQuickInfo(fileName, result);
            }
            return result;
        }

        return lang.getQuickInfoAtPosition(fileName, position);
    }
}
