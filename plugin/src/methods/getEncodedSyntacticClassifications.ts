import { LanguageService, TextSpan, Classifications } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers, } from "./../transformers";
export function getEncodedSyntacticClassificationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath }: Utils,
    { inTextSpan, outClassifications }: Mappers
): LanguageService['getEncodedSyntacticClassifications'] {
    return function (fileName: string, span: TextSpan): Classifications {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newSpan = inTextSpan(fileName, span);
            const result = lang.getEncodedSyntacticClassifications(newFileName, newSpan);
            if (result) {
                return outClassifications(fileName, result);
            }
        }

        return lang.getEncodedSyntacticClassifications(fileName, span);
    }
}
