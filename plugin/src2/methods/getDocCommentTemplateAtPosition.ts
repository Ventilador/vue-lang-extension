import { LanguageService, TextInsertion } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getDocCommentTemplateAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outTextInsertion }: Mappers
): LanguageService['getDocCommentTemplateAtPosition'] {
    return function (fileName: string, position: number): TextInsertion | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getDocCommentTemplateAtPosition(newFileName, newPosition);
            if (result) {
                return outTextInsertion(fileName, result);
            }
            return result;
        }

        return lang.getDocCommentTemplateAtPosition(fileName, position);
    }
}
