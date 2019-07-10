import { LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";
export function getBraceMatchingAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsFile }: UtilsSync,
    { outTextSpan }: Mappers
): LanguageService['getBraceMatchingAtPosition'] {
    return function (fileName: string, position: number): TextSpan[] {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getBraceMatchingAtPosition(newFileName, newPosition);
            if (result.length) {
                return result.map(outTextSpan, fileName);
            }
            return result;
        }

        return lang.getBraceMatchingAtPosition(fileName, position);
    }
}





