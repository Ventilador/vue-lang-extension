import { Move, Enum } from "@vue-lang/serialization";
import { TextSpan } from "./textSpan";
import { Serializer } from "@vue-lang/serialization";


@Move()
export class NavigateToItem extends Serializer implements ts.NavigateToItem {
    @Move(String) name: string;
    @Move(Enum) kind: ts.ScriptElementKind;
    @Move(String) kindModifiers: string;
    @Move(String) matchKind: "exact" | "prefix" | "substring" | "camelCase";
    @Move(Boolean) isCaseSensitive: boolean;
    @Move(String) fileName: string;
    @Move(TextSpan) textSpan: TextSpan;
    @Move(String) containerName: string;
    @Move(Enum) containerKind: ts.ScriptElementKind;
}