import { ClassifiedSpan, LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getSyntacticClassificationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath }: Utils,
    { inTextSpan, outClassifiedSpan }: Mappers
): LanguageService['getSyntacticClassifications'] {
    return function (fileName: string, span: TextSpan): ClassifiedSpan[] {
        debugger;
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newSpan = inTextSpan(fileName, span);
            const result = lang.getSyntacticClassifications(newFileName, newSpan);
            if (result.length) {
                return result.map(outClassifiedSpan, fileName);
            }
        }

        return lang.getSyntacticClassifications(fileName, span);
    }
}
