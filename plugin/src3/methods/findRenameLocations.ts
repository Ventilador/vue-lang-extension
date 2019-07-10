import { LanguageService, RenameLocation } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";
export function findRenameLocationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsFile }: UtilsSync,
    { outRenameLocation }: Mappers
): LanguageService['findRenameLocations'] {
    return function (fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename: boolean | undefined): ReadonlyArray<RenameLocation> | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.findRenameLocations(newFileName, newPosition, findInStrings, findInComments, providePrefixAndSuffixTextForRename);
            if (result && result.length) {
                return result.map(outRenameLocation, fileName);
            }

            return result;
        }

        return lang.findRenameLocations(fileName, position, findInStrings, findInComments, providePrefixAndSuffixTextForRename);
    }
}





