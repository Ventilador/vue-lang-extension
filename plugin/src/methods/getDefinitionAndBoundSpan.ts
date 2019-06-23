import { DefinitionInfoAndBoundSpan, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getDefinitionAndBoundSpanFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outDefinitionInfoAndBoundSpan }: Mappers
): LanguageService['getDefinitionAndBoundSpan'] {
    return function (fileName: string, position: number): DefinitionInfoAndBoundSpan | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getDefinitionAndBoundSpan(newFileName, newPosition);
            if (result) {
                return outDefinitionInfoAndBoundSpan(fileName, result);
            }
            return result;
        }

        return lang.getDefinitionAndBoundSpan(fileName, position);
    }
}
