import { LanguageService, GetCompletionsAtPositionOptions, WithMetadata, CompletionInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function getCompletionsAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outWithMetadataCompletionInfo }: Mappers
): LanguageService['getCompletionsAtPosition'] {
    return function (fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): WithMetadata<CompletionInfo> | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getCompletionsAtPosition(newFileName, newPosition, options);
            if (result) {
                debugger;
                return outWithMetadataCompletionInfo(fileName, result);
            }
            return result;
        }

        return lang.getCompletionsAtPosition(fileName, position, options);
    }
}
