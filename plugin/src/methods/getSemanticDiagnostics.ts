import { LanguageService, Diagnostic } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSemanticDiagnosticsFactory(lang: LanguageService, utils: Utils, { outDiagnostic }: Mappers): LanguageService['getSemanticDiagnostics'] {
    const { isVueFile, synchronize, toTsPath } = utils;
    return function (fileName: string): Diagnostic[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getSemanticDiagnostics(toTsPath(fileName));
            if (result.length) {
                return result.map(outDiagnostic, fileName);
            }
            return result;
        }

        return lang.getSemanticDiagnostics(fileName);
    }
}
