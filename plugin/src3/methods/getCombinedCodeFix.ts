import { CombinedCodeActions, CombinedCodeFixScope, FormatCodeSettings, LanguageService, UserPreferences } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";
export function getCombinedCodeFixFactory(
    lang: LanguageService,
    { isVueFile, synchronize }: UtilsSync,
    { inCombinedCodeFixScope, outCombinedCodeActions, }: Mappers
): LanguageService['getCombinedCodeFix'] {
    return function (scope: CombinedCodeFixScope, fixId: {}, formatOptions: FormatCodeSettings, preferences: UserPreferences): CombinedCodeActions {
        debugger;
        if (isVueFile(scope.fileName)) {
            synchronize();
            scope = inCombinedCodeFixScope(scope.fileName, scope);

            const result = lang.getCombinedCodeFix(scope, fixId, formatOptions, preferences);
            if (result) {
                return outCombinedCodeActions(scope.fileName, result);
            }
        }

        return lang.getCombinedCodeFix(scope, fixId, formatOptions, preferences);
    }
}





