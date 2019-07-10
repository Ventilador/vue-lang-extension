import { CompletionInfo, GetCompletionsAtPositionOptions, LanguageService, WithMetadata } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "./../tsUtils";
import { Mappers } from "./../mappers";
export function getCompletionsAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsFile, calculatePosition }: UtilsSync,
    { outWithMetadataCompletionInfo }: Mappers
): LanguageService['getCompletionsAtPosition'] {
    return function (fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): WithMetadata<CompletionInfo> | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getCompletionsAtPosition(newFileName, newPosition, options);
            if (result) {
                return outWithMetadataCompletionInfo(fileName, result);
            }
            return result;
        }

        return lang.getCompletionsAtPosition(fileName, position, options);
    }
}





