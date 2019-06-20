import { LanguageService, FormatCodeSettings, UserPreferences, FileTextChanges } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
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
