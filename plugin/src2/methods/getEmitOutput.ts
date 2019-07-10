import { EmitOutput, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getEmitOutputFactory(lang: LanguageService, { isVueFile, synchronize, toTsPath, }: Utils, _: Mappers): LanguageService['getEmitOutput'] {
    return function (fileName: string, emitOnlyDtsFiles: boolean | undefined): EmitOutput {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getEmitOutput(toTsPath(fileName), emitOnlyDtsFiles);
            if (result) {
                return result;
            }
            return result;
        }


        return lang.getEmitOutput(fileName, emitOnlyDtsFiles);
    }
}
