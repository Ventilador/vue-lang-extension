import { LanguageService, TextRange, UserPreferences, ApplicableRefactorInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { enter, exit, getFileName, Mappers, } from "../transformers";
export function getApplicableRefactorsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsPath }: Utils,
    { inNumberOrTextRange, outApplicableRefactorInfo }: Mappers
): LanguageService['getApplicableRefactors'] {
    return function (fileName: string, positionOrRange: number | TextRange, preferences: UserPreferences | undefined): ApplicableRefactorInfo[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = inNumberOrTextRange(fileName, positionOrRange);
            const result = lang.getApplicableRefactors(newFileName, newPosition, preferences);
            if (result.length) {
                return result.map(outApplicableRefactorInfo, fileName);
            }
            return result;
        }


        return lang.getApplicableRefactors(fileName, positionOrRange, preferences);
    }
}
