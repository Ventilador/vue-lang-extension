import './logger';
import * as tsLib from 'typescript/lib/tsserverlibrary';
import { LanguageService, server } from 'typescript/lib/tsserverlibrary';
import { patchFsLikeMethods } from './createFsMethodWrappers';
import { MethodFactories } from './methods';
import { patchProject } from './project';
import { createUtils } from './utils';
import { createMappers } from './mappers';



export = function init({ typescript: ts }: { typescript: typeof tsLib }): server.PluginModule {
    const utils = createUtils(ts);
    const mappers = createMappers(utils);
    patchProject(ts.server.ProjectService.prototype, mappers, utils);
    patchFsLikeMethods(ts.sys, utils);
    patchFsLikeMethods(ts.server.Project.prototype, utils);
    return {
        create: function (info: server.PluginCreateInfo): LanguageService {
            const { languageService } = info;
            const keys: (keyof LanguageService)[] = Object.keys(languageService) as any;

            const newUtils = Object.assign({
                isVueFile: utils.shouldRemap,
                synchronize: utils.synchronizer(info.project),
                toTsPath: utils.originatingFileName,
            }, utils);

            return createService(languageService, keys, newUtils, mappers);
        }
    }
}
function createService(lang: any, keys: (keyof LanguageService)[], newUtils: any, mappers: any) {
    return keys.reduce((prev: any, cur: keyof LanguageService) => {
        if (MethodFactories[cur + 'Factory']) {
            prev[cur] = MethodFactories[cur + 'Factory'](lang, newUtils, mappers);
        } else {
            prev[cur] = lang[cur];
        }
        return prev;
    }, {}) as LanguageService;
}
