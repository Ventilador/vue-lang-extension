import { LanguageService, JsxClosingTagInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getJsxClosingTagAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outJsxClosingTagInfo }: Mappers
): LanguageService['getJsxClosingTagAtPosition'] {
    return function (fileName: string, position: number): JsxClosingTagInfo | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getJsxClosingTagAtPosition(newFileName, newPosition);
            if (result) {
                debugger;
                return outJsxClosingTagInfo(fileName, result);
            }
        }

        return lang.getJsxClosingTagAtPosition(fileName, position);
    }
}
