import { LanguageService, ImplementationLocation } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getImplementationAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outImplementationLocation }: Mappers
): LanguageService['getImplementationAtPosition'] {
    return function (fileName: string, position: number): ReadonlyArray<ImplementationLocation> | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getImplementationAtPosition(newFileName, newPosition);
            if (result && result.length) {
                debugger;
                return result && result.map(outImplementationLocation, fileName);
            }
            return result;
        }

        return lang.getImplementationAtPosition(fileName, position);
    }
}
