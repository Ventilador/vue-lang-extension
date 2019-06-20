import { LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { enter, exit, getFileName, Mappers, } from "../transformers";
export function getBreakpointStatementAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsPath }: Utils,
    { outTextSpan }: Mappers
): LanguageService['getBreakpointStatementAtPosition'] {
    return function (fileName: string, position: number): TextSpan | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getBreakpointStatementAtPosition(newFileName, newPosition);
            if (result) {
                debugger;
                return outTextSpan(fileName, result);
            }

            return result;
        }

        return lang.getBreakpointStatementAtPosition(fileName, position);
    }
}
