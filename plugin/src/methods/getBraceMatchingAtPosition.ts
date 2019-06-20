import { LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { enter, exit, getFileName, Mappers, } from "../transformers";
export function getBraceMatchingAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsPath }: Utils,
    { outTextSpan }: Mappers
): LanguageService['getBraceMatchingAtPosition'] {
    return function (fileName: string, position: number): TextSpan[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getBraceMatchingAtPosition(newFileName, newPosition);
            if (result.length) {
                debugger;
                return result.map(outTextSpan, fileName);
            }
            return result;
        }

        return lang.getBraceMatchingAtPosition(fileName, position);
    }
}
