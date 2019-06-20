import { LanguageService, SelectionRange } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getSmartSelectionRangeFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outSelectionRange }: Mappers
): LanguageService['getSmartSelectionRange'] {
    return function (fileName: string, position: number): SelectionRange {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getSmartSelectionRange(newFileName, newPosition);
            if (result) {
                debugger;
                return outSelectionRange(fileName, result);
            }
            return result;
        }

        return lang.getSmartSelectionRange(fileName, position);
    }
}
