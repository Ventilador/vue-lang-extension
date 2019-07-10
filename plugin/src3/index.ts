// import './logger';
import * as tsLib from 'typescript/lib/tsserverlibrary';
import { LanguageService, server } from 'typescript/lib/tsserverlibrary';

export = function init({ typescript: ts }: { typescript: typeof tsLib }): server.PluginModule {
    debugger;
    return {
        create: function (info: server.PluginCreateInfo): LanguageService {
            debugger;
            const orig: any = info.serverHost.readFile;
            info.serverHost.readFile = function (this: any) {
                return orig.apply(this, arguments);
            } as any
            const asd = info.languageServiceHost.readFile!(__filename);
            return info.languageService;
        }
    }
}
