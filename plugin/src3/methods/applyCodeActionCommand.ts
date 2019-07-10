import { LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function applyCodeActionCommandFactory(lang: LanguageService, _: Utils, __: Mappers): LanguageService['applyCodeActionCommand'] {
    return function (): Promise<any> {
        console.trace(arguments);
        return lang.applyCodeActionCommand.apply(lang, arguments as any);
    }
}





