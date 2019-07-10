import { EmitOutput, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getEmitOutputFactory(lang: LanguageService, { isVueFile, synchronize, toTsFile, }: UtilsSync, _: Mappers): LanguageService['getEmitOutput'] {
    return function (fileName: string, emitOnlyDtsFiles: boolean | undefined): EmitOutput {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const result = lang.getEmitOutput(toTsFile(fileName), emitOnlyDtsFiles);
            if (result) {
                return result;
            }
            return result;
        }


        return lang.getEmitOutput(fileName, emitOnlyDtsFiles);
    }
}





