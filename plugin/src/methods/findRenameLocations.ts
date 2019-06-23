import { LanguageService, RenameLocation } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { Mappers } from "../transformers";
export function findRenameLocationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsPath }: Utils,
    { outRenameLocation }: Mappers
): LanguageService['findRenameLocations'] {
    return function (fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename: boolean | undefined): ReadonlyArray<RenameLocation> | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.findRenameLocations(newFileName, newPosition, findInStrings, findInComments, providePrefixAndSuffixTextForRename);
            if (result && result.length) {
                return result.map(outRenameLocation, fileName);
            }

            return result;
        }

        return lang.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename);
    }
}
