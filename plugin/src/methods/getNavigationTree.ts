import { LanguageService, NavigationTree } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getNavigationTreeFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outNavigationTree }: Mappers): LanguageService['getNavigationTree'] {
    return function (fileName: string): NavigationTree {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getNavigationTree(toTsPath(fileName));
            if (result) {
                return outNavigationTree(fileName, result);
            }

            return result;
        }

        return lang.getNavigationTree(fileName);
    }
}
