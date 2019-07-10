import { CodeFixAction, FormatCodeSettings, LanguageService, UserPreferences } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";
export function getCodeFixesAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsFile }: UtilsSync,
    { outCodeFixAction }: Mappers
): LanguageService['getCodeFixesAtPosition'] {
    return function (fileName: string, start: number, end: number, errorCodes: ReadonlyArray<number>, formatOptions: FormatCodeSettings, preferences: UserPreferences): ReadonlyArray<CodeFixAction> {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newStart = calculatePosition({from:fileName,to:toTsFile(fileName)}, start);
            const newEnd = calculatePosition({from:fileName,to:toTsFile(fileName)}, end);
            const result = lang.getCodeFixesAtPosition(newFileName, newStart, newEnd, errorCodes, formatOptions, preferences);
            if (result.length) {
                return result.map(outCodeFixAction, fileName);
            }

            return result;
        }

        return lang.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences);
    }
}





