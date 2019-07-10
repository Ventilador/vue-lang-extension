import { DefinitionInfoAndBoundSpan, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getDefinitionAndBoundSpanFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outDefinitionInfoAndBoundSpan }: Mappers
): LanguageService['getDefinitionAndBoundSpan'] {
    return function (fileName: string, position: number): DefinitionInfoAndBoundSpan | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getDefinitionAndBoundSpan(newFileName, newPosition);
            if (result) {
                return outDefinitionInfoAndBoundSpan(fileName, result);
            }
            return result;
        }

        return lang.getDefinitionAndBoundSpan(fileName, position);
    }
}





