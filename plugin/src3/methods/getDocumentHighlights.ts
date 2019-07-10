import { DocumentHighlights, LanguageService } from "typescript/lib/tsserverlibrary";
import { UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getDocumentHighlightsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outDocumentHighlights }: Mappers
): LanguageService['getDocumentHighlights'] {
    return function (fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[] | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            filesToSearch = filesToSearch.map(file => isVueFile(file) ? toTsFile(file) : file);
            const result = lang.getDocumentHighlights(newFileName, newPosition, filesToSearch);
            if (result && result.length) {
                return result.map(outDocumentHighlights, fileName);
            }
            return result;
        }

        return lang.getDocumentHighlights(fileName, position, filesToSearch);
    }
}





