import { ImplementationLocation, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getImplementationAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outImplementationLocation }: Mappers
): LanguageService['getImplementationAtPosition'] {
    return function (fileName: string, position: number): ReadonlyArray<ImplementationLocation> | undefined {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getImplementationAtPosition(newFileName, newPosition);
            if (result && result.length) {
                return result && result.map(outImplementationLocation, fileName);
            }
            return result;
        }

        return lang.getImplementationAtPosition(fileName, position);
    }
}
