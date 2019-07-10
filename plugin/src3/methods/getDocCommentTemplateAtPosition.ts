import { LanguageService, TextInsertion } from "typescript/lib/tsserverlibrary";
import { UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getDocCommentTemplateAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outTextInsertion }: Mappers
): LanguageService['getDocCommentTemplateAtPosition'] {
    return function (fileName: string, position: number): TextInsertion | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getDocCommentTemplateAtPosition(newFileName, newPosition);
            if (result) {
                return outTextInsertion(fileName, result);
            }
            return result;
        }

        return lang.getDocCommentTemplateAtPosition(fileName, position);
    }
}





