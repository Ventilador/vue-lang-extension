import { LanguageService, FormatCodeOptions, FormatCodeSettings, UserPreferences, CompletionEntryDetails } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getCompletionEntryDetailsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outCompletionEntryDetails }: Mappers
): LanguageService['getCompletionEntryDetails'] {
    return function (fileName: string, position: number, name: string, formatOptions: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined, preferences: UserPreferences | undefined): CompletionEntryDetails | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getCompletionEntryDetails(newFileName, newPosition, name, formatOptions, source, preferences);
            if (result) {
                return outCompletionEntryDetails(fileName, result);
            }
            return result;
        }

        return lang.getCompletionEntryDetails(fileName, position, name, formatOptions, source, preferences);
    }
}
