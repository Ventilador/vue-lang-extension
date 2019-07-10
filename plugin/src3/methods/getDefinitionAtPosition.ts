import { DefinitionInfo, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils, UtilsSync } from "../tsUtils";
import { Mappers } from "../mappers";

export function getDefinitionAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, calculatePosition, toTsFile }: UtilsSync,
    { outDefinitionInfo }: Mappers
): LanguageService['getDefinitionAtPosition'] {
    return function (fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined {
        if (isVueFile(fileName)) {
            synchronize();
            const newFileName = toTsFile(fileName);
            const newPosition = calculatePosition({ from: fileName, to: toTsFile(fileName) }, position);
            const result = lang.getDefinitionAtPosition(newFileName, newPosition);
            if (result && result.length) {
                return result && result.map(outDefinitionInfo, fileName);
            }
            return result;
        }

        return lang.getDefinitionAtPosition(fileName, position);
    }
}





