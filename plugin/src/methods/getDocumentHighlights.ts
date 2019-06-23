import { DocumentHighlights, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getDocumentHighlightsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outDocumentHighlights }: Mappers
): LanguageService['getDocumentHighlights'] {
    return function (fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[] | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            filesToSearch = filesToSearch.map(file => isVueFile(file) ? toTsPath(file) : file);
            const result = lang.getDocumentHighlights(newFileName, newPosition, filesToSearch);
            if (result && result.length) {
                return result.map(outDocumentHighlights, fileName);
            }
            return result;
        }

        return lang.getDocumentHighlights(fileName, position, filesToSearch);
    }
}
