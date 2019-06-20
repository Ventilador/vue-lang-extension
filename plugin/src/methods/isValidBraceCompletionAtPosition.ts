import { LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function isValidBraceCompletionAtPositionFactory(lang: LanguageService, { isVueFile, synchronize, toTsPath, calculatePosition }: Utils, _: Mappers): LanguageService['isValidBraceCompletionAtPosition'] {
    return function (fileName: string, position: number, openingBrace: number): boolean {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.isValidBraceCompletionAtPosition(newFileName, newPosition, openingBrace);

            debugger;
            return result;
        }

        return lang.isValidBraceCompletionAtPosition(fileName, position, openingBrace);
    }
}
