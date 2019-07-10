import { FileTextChanges, FormatCodeSettings, LanguageService, UserPreferences } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getEditsForFileRenameFactory(
    lang: LanguageService,
    _: Utils,
    { outFileTextChanges, }: Mappers
): LanguageService['getEditsForFileRename'] {
    return function (oldFilePath: string, newFilePath: string, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges> {
        return lang
            .getEditsForFileRename(oldFilePath, newFilePath, formatOptions, preferences)
            .map(change => {
                return outFileTextChanges(change.fileName, change);
            });
    }

}
