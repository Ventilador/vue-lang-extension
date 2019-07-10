import { LanguageService, FormatCodeSettings, TextRange, UserPreferences, RefactorEditInfo } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { enter, exit, getFileName, Mappers } from "./../mappers";
export function getEditsForRefactorFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile }: UtilsSync,
    { inNumberOrTextRange, outRefactorEditInfo }: Mappers
): LanguageService['getEditsForRefactor'] {
    return function (fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string, preferences: UserPreferences | undefined): RefactorEditInfo | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const position = inNumberOrTextRange(fileName, positionOrRange);
            const result = lang.getEditsForRefactor(newFileName, formatOptions, position, refactorName, actionName, preferences);
            if (result) {
                return outRefactorEditInfo(fileName, result);
            }

            return result;
        }

        return lang.getEditsForRefactor(fileName, formatOptions, positionOrRange, refactorName, actionName, preferences);
    }
}





