import { LanguageService, EmitOutput } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getEmitOutputFactory(lang: LanguageService, { isVueFile, synchronize, toTsPath, }: Utils, _: Mappers): LanguageService['getEmitOutput'] {
    return function (fileName: string, emitOnlyDtsFiles: boolean | undefined): EmitOutput {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getEmitOutput(toTsPath(fileName), emitOnlyDtsFiles);
            if (result) {
                debugger;
                return result;
            }
            return result;
        }


        return lang.getEmitOutput(fileName, emitOnlyDtsFiles);
    }
}
