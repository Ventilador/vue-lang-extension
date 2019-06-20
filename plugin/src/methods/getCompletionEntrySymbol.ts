import { LanguageService, Symbol } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getCompletionEntrySymbolFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    _: Mappers
): LanguageService['getCompletionEntrySymbol'] {
    return function (fileName: string, position: number, name: string, source: string | undefined): Symbol | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getCompletionEntrySymbol(newFileName, newPosition, name, source);
            if (result) {
                debugger;
                return result;
            }
            return result;
        }


        return lang.getCompletionEntrySymbol(fileName, position, name, source);
    }
}
