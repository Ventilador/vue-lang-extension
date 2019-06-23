import { CodeFixAction, FormatCodeSettings, LanguageService, UserPreferences } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { Mappers } from "../transformers";
export function getCodeFixesAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsPath }: Utils,
    { outCodeFixAction }: Mappers
): LanguageService['getCodeFixesAtPosition'] {
    return function (fileName: string, start: number, end: number, errorCodes: ReadonlyArray<number>, formatOptions: FormatCodeSettings, preferences: UserPreferences): ReadonlyArray<CodeFixAction> {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newStart = calculatePosition(fileName, start, false);
            const newEnd = calculatePosition(fileName, end, false);
            const result = lang.getCodeFixesAtPosition(newFileName, newStart, newEnd, errorCodes, formatOptions, preferences);
            if (result.length) {
                return result.map(outCodeFixAction, fileName);
            }

            return result;
        }

        return lang.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences);
    }
}
