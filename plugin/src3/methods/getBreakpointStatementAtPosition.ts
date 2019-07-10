import { LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";
export function getBreakpointStatementAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsFile }: UtilsSync,
    { outTextSpan }: Mappers
): LanguageService['getBreakpointStatementAtPosition'] {
    return function (fileName: string, position: number): TextSpan | undefined {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getBreakpointStatementAtPosition(newFileName, newPosition);
            if (result) {
                return outTextSpan(fileName, result);
            }

            return result;
        }

        return lang.getBreakpointStatementAtPosition(fileName, position);
    }
}





