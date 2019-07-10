import { LanguageService, FormatCodeSettings, TextRange, UserPreferences, RefactorEditInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getEditsForRefactorFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath }: Utils,
    { inNumberOrTextRange, outRefactorEditInfo }: Mappers
): LanguageService['getEditsForRefactor'] {
    return function (fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string, preferences: UserPreferences | undefined): RefactorEditInfo | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
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
