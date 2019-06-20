import { LanguageService, CombinedCodeFixScope, FormatCodeSettings, UserPreferences, CombinedCodeActions } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { enter, exit, getFileName, Mappers } from "../transformers";
export function getCombinedCodeFixFactory(
    lang: LanguageService,
    { isVueFile, synchronize }: Utils,
    { inCombinedCodeFixScope, outCombinedCodeActions, }: Mappers
): LanguageService['getCombinedCodeFix'] {
    return function (scope: CombinedCodeFixScope, fixId: {}, formatOptions: FormatCodeSettings, preferences: UserPreferences): CombinedCodeActions {
        if (isVueFile(scope.fileName)) {
            synchronize(scope.fileName);
            scope = inCombinedCodeFixScope(scope.fileName, scope);

            const result = lang.getCombinedCodeFix(scope, fixId, formatOptions, preferences);
            if (result) {
                debugger;
                return outCombinedCodeActions(scope.fileName, result);
            }
        }

        return lang.getCombinedCodeFix(scope, fixId, formatOptions, preferences);
    }
}
