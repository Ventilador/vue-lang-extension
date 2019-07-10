import { LanguageService, ReferencedSymbol } from "typescript/lib/tsserverlibrary";
import { Mappers } from "../mappers";
import { Utils, UtilsSync } from "./../tsUtils";

export function findReferencesFactory(lang: LanguageService, { isVueFile, synchronize, toTsFile, calculatePosition, outOfBounds }: UtilsSync, { outReferencedSymbol }: Mappers): LanguageService['findReferences'] {
    return function (fileName: string, position: number): ReferencedSymbol[] | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            if (outOfBounds(fileName, newPosition)) {
                return;
            }
            const newFileName = toTsFile(fileName);
            const result = lang.findReferences(newFileName, newPosition);
            if (result && result.length) {
                return result.map(outReferencedSymbol, fileName);
            }

            return result;
        }

        return lang.findReferences(fileName, position);
    }
}





