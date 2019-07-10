import { LanguageService, FormatCodeOptions, FormatCodeSettings, TextChange } from "typescript/lib/tsserverlibrary";
import { UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getFormattingEditsForDocumentFactory(lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outTextChange }: Mappers): LanguageService['getFormattingEditsForDocument'] {
    return function (fileName: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[] {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const result = lang.getFormattingEditsForDocument(newFileName, options);
            if (result.length) {
                return result.map(outTextChange, fileName);
            }

            return result;
        }

        return lang.getFormattingEditsForDocument(fileName, options);
    }
}





