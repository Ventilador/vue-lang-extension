import { LanguageService, LineAndCharacter } from "typescript/lib/tsserverlibrary";
import { Utils } from "./../cache";
import { enter, exit, getFileName, Mappers } from "./../transformers";
export function toLineColumnOffsetFactory(
    lang: LanguageService,
    { isVueFile, synchronize, toTsPath, calculatePosition }: Utils,
    { outLineAndCharacter }: Mappers): LanguageService['toLineColumnOffset'] {
    return function (fileName: string, position: number): LineAndCharacter {
        if (isVueFile(fileName)) {
            synchronize(fileName);
            const newFileName = toTsPath(fileName);
            const newPosition = calculatePosition(fileName, position, false);
            const result = lang.toLineColumnOffset!(newFileName, newPosition);
            if (result) {
                debugger;
                return outLineAndCharacter(fileName, result);
            }
            return result;
        }

        return lang.toLineColumnOffset!(fileName, position);
    }
}
