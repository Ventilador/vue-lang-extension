import { LanguageService, DefinitionInfo } from "typescript/lib/tsserverlibrary";
import { Utils } from "../cache";
import { Mappers } from "../transformers";

export function getDefinitionAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsPath }: Utils,
    { outDefinitionInfo }: Mappers
): LanguageService['getDefinitionAtPosition'] {
    return function (fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getDefinitionAtPosition(newFileName, newPosition);
            if (result && result.length) {
                debugger;
                return result && result.map(outDefinitionInfo, fileName);
            }
            return result;
        }

        return lang.getDefinitionAtPosition(fileName, position);
    }
}
