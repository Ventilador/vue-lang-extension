import { LanguageService, TextSpan, Classifications } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getEncodedSemanticClassificationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath }: Utils,
    { inTextSpan, outClassifications }: Mappers
): LanguageService['getEncodedSemanticClassifications'] {
    return function (fileName: string, span: TextSpan): Classifications {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newSpan = inTextSpan(fileName, span);
            const result = lang.getEncodedSemanticClassifications(newFileName, newSpan);
            if (result) {
                debugger;
                return outClassifications(fileName, result);
            }
        }

        return lang.getEncodedSemanticClassifications(fileName, span);
    }
}
