import { LanguageService, TextSpan, ClassifiedSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSemanticClassificationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { inTextSpan, outClassifiedSpan }: Mappers

): LanguageService['getSemanticClassifications'] {
    return function (fileName: string, span: TextSpan): ClassifiedSpan[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newSpan = inTextSpan(fileName, span);
            const result = lang.getSemanticClassifications(newFileName, newSpan);
            if (result && result.length) {
                debugger;
                return result.map(outClassifiedSpan, fileName);
            }
        }


        return lang.getSemanticClassifications(fileName, span);
    }
}
