import { LanguageService, NavigateToItem, server } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getNavigateToItemsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outNavigateToItem }: Mappers
): LanguageService['getNavigateToItems'] {
    return function (searchValue: string, maxResultCount: number | undefined, fileName: string | undefined, excludeDtsFiles: boolean | undefined): NavigateToItem[] {
        if (fileName && isVueFile(fileName)) {
            const newFile = toTsPath(fileName);
            const result = lang.getNavigateToItems(searchValue, maxResultCount, newFile, excludeDtsFiles);
            if (result.length) {
                debugger;
                return result.map(outNavigateToItem, fileName);
            }

            return result;
        }

        return lang.getNavigateToItems(searchValue, maxResultCount, fileName, excludeDtsFiles);
    }
}
