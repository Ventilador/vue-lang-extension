import { DiagnosticWithLocation, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSuggestionDiagnosticsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath }: Utils,
    { outDiagnosticWithLocation }: Mappers
): LanguageService['getSuggestionDiagnostics'] {
    return function (fileName: string): DiagnosticWithLocation[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getSuggestionDiagnostics(toTsPath(fileName));
            if (result.length) {
                return result.map(outDiagnosticWithLocation, fileName);
            }
            return result;
        }

        return lang.getSuggestionDiagnostics(fileName);
    }
}
