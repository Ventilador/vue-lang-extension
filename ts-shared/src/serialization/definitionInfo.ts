import { DocumentSpan } from "./documentSpan";
import { Move, Enum } from "@vue-lang/serialization";

@Move()
export class DefinitionInfo extends DocumentSpan implements ts.DefinitionInfo {
    @Move(Enum) kind: ts.ScriptElementKind;
    @Move(Enum) containerKind: ts.ScriptElementKind;
    @Move(String) name: string;
    @Move(String) containerName: string;
}