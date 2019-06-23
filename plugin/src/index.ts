import './logger';
import * as tsLib from 'typescript/lib/tsserverlibrary';

import { LanguageService, server } from 'typescript/lib/tsserverlibrary';
import { patchFsLikeMethods } from './createFsMethodWrappers';
import { MethodFactories } from './methods';
import { patchProject } from './project';
import { createUtils } from './utils';
import { createMappers } from './mappers';
import { OpenFileArguments } from './project/applyChangesInOpenFiles';
import { patchScriptInfo } from './patchScriptInfo';

export = function init({ typescript: ts }: { typescript: typeof tsLib }): server.PluginModule {
    const utils = createUtils(ts);
    const mappers = createMappers(utils);
    patchProject(ts.server.ProjectService.prototype, mappers, utils);
    patchScriptInfo(ts.server.ScriptInfo.prototype, utils);
    patchFsLikeMethods(ts.sys, utils);
    patchFsLikeMethods(ts.server.Project.prototype, utils);
    return {
        create: function (info: server.PluginCreateInfo): LanguageService {
            const { languageService } = info;
            const keys: (keyof LanguageService)[] = Object.keys(languageService) as any;

            // patchProject(info.project, utils, mappers);
            const newUtils = Object.assign({
                isVueFile: utils.shouldRemap,
                synchronize: () => { },
                toTsPath: utils.originatingFileName,
            }, utils)
            const toClose: string[] = [];
            info.project.projectService.openFiles.forEach((_, key) => {
                if (utils.shouldRemap(key) && !utils.has(key)) {
                    toClose.push(key);
                }
            });
            if (toClose.length) {
                toClose.forEach(i => {
                    const old = info.project.getScriptInfo(i);
                    if (old) {
                        const snap = old.getSnapshot();
                        const size = snap.getLength();
                        old.editContent(0, size, utils.reload(i, snap.getText(0, size)));
                    }
                });
            }

            return createService(languageService, keys, newUtils, mappers);

            function init() {
                const toClose: string[] = [];
                info.project.projectService.openFiles.forEach((_, key) => {
                    if (utils.shouldRemap(key) && !utils.has(key)) {
                        toClose.push(key);
                    }
                });
                if (toClose.length) {
                    const toOpen: OpenFileArguments[] = toClose.map<OpenFileArguments>(i => {
                        const old = info.project.getScriptInfo(i);
                        if (old) {
                            const snap = old.getSnapshot();
                            const size = snap.getLength();
                            old.editContent(0, size, utils.reload(i, snap.getText(0, size)));
                        }
                        return undefined as any;
                    }).filter(Boolean);
                    const arrayIterator = (ts as any).arrayIterator;
                    const service = (info.project.projectService as any);
                    service.applyChangesInOpenFiles(undefined, undefined, toClose);
                    service.applyChangesInOpenFiles(arrayIterator(toOpen));
                }

            }
        }
    }
}
function createService(lang: any, keys: (keyof LanguageService)[], newUtils: any, mappers: any) {
    // let first: any = true;
    return keys.reduce((prev: any, cur: keyof LanguageService) => {
        if (isPatched(lang[cur])) {
            return prev;
        }
        if (MethodFactories[cur + 'Factory']) {
            // const method = MethodFactories[cur + 'Factory'](lang, newUtils, mappers);
            prev[cur] = MethodFactories[cur + 'Factory'](lang, newUtils, mappers);
        } else {
            prev[cur] = lang[cur];
        }
        patch(lang[cur]);
        return prev;
    }, {}) as LanguageService;
}
const patched = Symbol('patched');
function patch<T>(val: T): T {
    (val as any)[patched] = true;
    return val;
}
function isPatched(val: any): boolean {
    return !!val[patched];
}
