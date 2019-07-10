import { LanguageService, LineAndCharacter } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { Mappers } from "./../transformers";
export function toLineColumnOffsetFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition, outOfBounds }: Utils,
    { outLineAndCharacter }: Mappers): LanguageService['toLineColumnOffset'] {
    return function (fileName: string, position: number): LineAndCharacter {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            if (!outOfBounds(fileName, newPosition)) {
                const result = lang.toLineColumnOffset!(newFileName, newPosition);
                return outLineAndCharacter(fileName, result);
            }
        }

        return lang.toLineColumnOffset!(fileName, position);
    }
}
