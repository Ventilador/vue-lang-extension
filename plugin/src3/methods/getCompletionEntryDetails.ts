import { CompletionEntryDetails, FormatCodeOptions, FormatCodeSettings, LanguageService, UserPreferences } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getCompletionEntryDetailsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outCompletionEntryDetails }: Mappers
): LanguageService['getCompletionEntryDetails'] {
    return function (fileName: string, position: number, name: string, formatOptions: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined, preferences: UserPreferences | undefined): CompletionEntryDetails | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getCompletionEntryDetails(newFileName, newPosition, name, formatOptions, source, preferences);
            if (result) {
                return outCompletionEntryDetails(fileName, result);
            }
            return result;
        }

        return lang.getCompletionEntryDetails(fileName, position, name, formatOptions, source, preferences);
    }
}





