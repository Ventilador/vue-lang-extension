import { LanguageService, ReferencedSymbol } from "typescript/lib/tsserverlibrary";
import { Mappers } from "../transformers";
import { Utils } from "./../cache";

export function findReferencesFactory(lang: LanguageService, { isVueFile, synchronize, toTsPath, calculatePosition, outOfBounds }: Utils, { outReferencedSymbol }: Mappers): LanguageService['findReferences'] {
    return function (fileName: string, position: number): ReferencedSymbol[] | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            if (outOfBounds(fileName, newPosition)) {
                return;
            }
            const newFileName = toTsPath(fileName);
            const result = lang.findReferences(newFileName, newPosition);
            if (result && result.length) {
                return result.map(outReferencedSymbol, fileName);
            }

            return result;
        }

        return lang.findReferences(fileName, position);
    }
}
