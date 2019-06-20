import { LanguageService, ReferencedSymbol } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "../transformers";

export function findReferencesFactory(lang: LanguageService, { isVueFile, synchronize, toTsPath, calculatePosition }: Utils, { outReferencedSymbol }: Mappers): LanguageService['findReferences'] {
    return function (fileName: string, position: number): ReferencedSymbol[] | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.findReferences(newFileName, newPosition);
            if (result && result.length) {
                debugger;
                return result.map(outReferencedSymbol, fileName);
            }

            return result;
        }

        return lang.findReferences(fileName, position);
    }
}
