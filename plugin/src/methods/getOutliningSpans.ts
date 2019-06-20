import { LanguageService, OutliningSpan } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getOutliningSpansFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath }: Utils,
    { outOutliningSpan }: Mappers): LanguageService['getOutliningSpans'] {
    return function (fileName: string): OutliningSpan[] {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const result = lang.getOutliningSpans(toTsPath(fileName));
            if (result.length) {
                return result.map(outOutliningSpan, fileName);
            }
            return result;
        }

        return lang.getOutliningSpans(fileName);
    }
}
