import { Classifications, LanguageService, TextSpan } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getEncodedSyntacticClassificationsFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile }: UtilsSync,
    { inTextSpan, outClassifications }: Mappers
): LanguageService['getEncodedSyntacticClassifications'] {
    return function (fileName: string, span: TextSpan): Classifications {
        debugger;
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newSpan = inTextSpan(fileName, span);
            const result = lang.getEncodedSyntacticClassifications(newFileName, newSpan);
            if (result) {
                return outClassifications(fileName, result);
            }
        }

        return lang.getEncodedSyntacticClassifications(fileName, span);
    }
}





