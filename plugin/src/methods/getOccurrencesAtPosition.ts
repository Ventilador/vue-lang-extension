import { LanguageService, ReferenceEntry } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getOccurrencesAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outReferenceEntry }: Mappers
): LanguageService['getOccurrencesAtPosition'] {
    return function (fileName: string, position: number): ReadonlyArray<ReferenceEntry> | undefined {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getOccurrencesAtPosition(newFileName, newPosition);
            if (result && result.length) {
                return result && result.map(outReferenceEntry, fileName);
            }
            return result;
        }


        return lang.getOccurrencesAtPosition(fileName, position);
    }
}
