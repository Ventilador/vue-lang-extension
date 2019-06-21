import { LanguageService, Diagnostic, server, SourceFile } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSourceMapperFactory(lang: LanguageService, _: Utils, __: Mappers): (file: string) => SourceFile {
    return (lang as any).getSourceMapper
}
