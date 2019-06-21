import { LanguageService, Diagnostic, server, SourceFile } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getNonBoundSourceFileFactory(lang: LanguageService, utils: Utils, { outDiagnostic }: Mappers): (file: string) => SourceFile {
    const { isVueFile, synchronize, toTsPath } = utils;
    return function (fileName: string): SourceFile {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            return (lang as any).getNonBoundSourceFile(toTsPath(fileName));
        }

        return (lang as any).getNonBoundSourceFile(fileName);
    }
}
