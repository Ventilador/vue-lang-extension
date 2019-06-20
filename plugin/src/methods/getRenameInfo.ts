import { LanguageService, RenameInfoOptions, RenameInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getRenameInfoFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outRenameInfo }: Mappers
): LanguageService['getRenameInfo'] {
    return function (fileName: string, position: number, options: RenameInfoOptions | undefined): RenameInfo {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getRenameInfo(newFileName, newPosition, options);
            if (result) {
                debugger;
                return outRenameInfo(fileName, result);
            }

            return result;
        }

        return lang.getRenameInfo(fileName, position, options);
    }
}
