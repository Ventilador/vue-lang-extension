import { LanguageService, Symbol } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getCompletionEntrySymbolFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    _: Mappers
): LanguageService['getCompletionEntrySymbol'] {
    return function (fileName: string, position: number, name: string, source: string | undefined): Symbol | undefined {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getCompletionEntrySymbol(newFileName, newPosition, name, source);
            if (result) {
                return result;
            }
            return result;
        }


        return lang.getCompletionEntrySymbol(fileName, position, name, source);
    }
}





