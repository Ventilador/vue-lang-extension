import { LanguageService, NavigationBarItem } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getNavigationBarItemsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outNavigationBarItem }: Mappers,
): LanguageService['getNavigationBarItems'] {
    return function (fileName: string): NavigationBarItem[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getNavigationBarItems(toTsPath(fileName));
            if (result.length) {
                debugger;
                return result.map(outNavigationBarItem, fileName);
            }
            return result;
        }

        return lang.getNavigationBarItems(fileName);
    }
}
