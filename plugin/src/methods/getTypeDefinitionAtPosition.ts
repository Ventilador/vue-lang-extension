import { DefinitionInfo, LanguageService } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function getTypeDefinitionAtPositionFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outDefinitionInfo }: Mappers
): LanguageService['getTypeDefinitionAtPosition'] {
    return function (fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.getTypeDefinitionAtPosition(newFileName, newPosition);
            if (result && result.length) {
                return result.map(outDefinitionInfo, fileName);
            }
            return result;
        }

        return lang.getTypeDefinitionAtPosition(fileName, position);
    }
}
