import { LanguageService, OrganizeImportsScope, FormatCodeSettings, UserPreferences, FileTextChanges } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function organizeImportsFactory(lang: LanguageService, utils: Utils, { inCombinedCodeFixScope, outFileTextChanges }: Mappers): LanguageService['organizeImports'] {
    const { isVueFile, synchronize } = utils;
    return function (scope: OrganizeImportsScope, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges> {
        if (isVueFile(scope.fileName)) {
            synchronize(scope.fileName);
            scope = inCombinedCodeFixScope(scope.fileName, scope);
            const result = lang.organizeImports(scope, formatOptions, preferences);

            if (result.length) {
                debugger;
                return result.map(r => outFileTextChanges(scope.fileName, r));
            }
            return result;
        }

        return lang.organizeImports(scope, formatOptions, preferences);
    }
}
