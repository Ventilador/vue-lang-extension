import { LanguageService, EditorOptions, EditorSettings } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getIndentationAtPositionFactory(lang: LanguageService, { isVueFile, synchronize, toTsPath, calculatePosition }: Utils, _: Mappers): LanguageService['getIndentationAtPosition'] {
    return function (fileName: string, position: number, options: EditorOptions | EditorSettings): number {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getIndentationAtPosition(newFileName, newPosition, options);

            return result;
        }

        return lang.getIndentationAtPosition(fileName, position, options);
    }
}
