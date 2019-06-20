import { LanguageService, FormatCodeOptions, FormatCodeSettings, TextChange } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getFormattingEditsForDocumentFactory(lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outTextChange }: Mappers): LanguageService['getFormattingEditsForDocument'] {
    return function (fileName: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const result = lang.getFormattingEditsForDocument(newFileName, options);
            if (result.length) {
                debugger;
                return result.map(outTextChange, fileName);
            }

            return result;
        }

        return lang.getFormattingEditsForDocument(fileName, options);
    }
}
