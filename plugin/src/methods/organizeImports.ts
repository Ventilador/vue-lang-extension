import { LanguageService, OrganizeImportsScope, FormatCodeSettings, UserPreferences, FileTextChanges } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function organizeImportsFactory(
    lang: LanguageService,
    { isVueFile, synchronize }: Utils,
    { inCombinedCodeFixScope, outFileTextChanges }: Mappers
): LanguageService['organizeImports'] {
    return function (scope: OrganizeImportsScope, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges> {
        if (isVueFile(scope.fileName)) {
            synchronize(scope.fileName);
            scope = inCombinedCodeFixScope(scope.fileName, scope);
            const result = lang.organizeImports(scope, formatOptions, preferences);

            if (result.length) {
                return result.map(outFileTextChanges, scope.fileName);
            }
            return result;
        }

        return lang.organizeImports(scope, formatOptions, preferences);
    }
}
