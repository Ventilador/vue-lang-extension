import { LanguageService, SignatureHelpItemsOptions, SignatureHelpItems } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
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
                debugger;
                return outSignatureHelpItems(fileName, result);
            }
            return result;
        }

        return lang.getSignatureHelpItems(fileName, position, options);
    }
}
