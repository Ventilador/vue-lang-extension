import { LanguageService, SignatureHelpItems, SignatureHelpItemsOptions } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSignatureHelpItemsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outSignatureHelpItems }: Mappers
): LanguageService['getSignatureHelpItems'] {
    return function (fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): SignatureHelpItems | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getSignatureHelpItems(newFileName, newPosition, options);
            if (result) {
                return outSignatureHelpItems(newFileName, result);
            }
            return result;
        }

        return lang.getSignatureHelpItems(fileName, position, options);
    }
}
