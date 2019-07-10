import { ApplicableRefactorInfo, LanguageService, TextRange, UserPreferences } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";
export function getApplicableRefactorsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, outOfBounds, toTsFile }: UtilsSync,
    { inNumberOrTextRange, outApplicableRefactorInfo }: Mappers
): LanguageService['getApplicableRefactors'] {
    return function (fileName: string, positionOrRange: number | TextRange, preferences: UserPreferences | undefined): ApplicableRefactorInfo[] {
        if (isVueFile(fileName)) {
            synchronize();
            const newPosition = inNumberOrTextRange(fileName, positionOrRange);
            if (outOfBounds(fileName, newPosition)) {
                return [];
            }
            const newFileName = toTsFile(fileName);
            const result = lang.getApplicableRefactors(newFileName, newPosition, preferences);
            if (result.length) {
                return result.map(outApplicableRefactorInfo, fileName);
            }
            return result;
        }


        return lang.getApplicableRefactors(fileName, positionOrRange, preferences);
    }
}





