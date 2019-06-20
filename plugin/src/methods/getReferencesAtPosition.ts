import { LanguageService, ReferenceEntry } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getReferencesAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outReferenceEntry }: Mappers
): LanguageService['getReferencesAtPosition'] {
    return function (fileName: string, position: number): ReferenceEntry[] | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getReferencesAtPosition(newFileName, newPosition);
            if (result && result.length) {
                debugger;
                return result.map(outReferenceEntry, fileName);
            }
            return result;
        }

        return lang.getReferencesAtPosition(fileName, position);
    }
}
