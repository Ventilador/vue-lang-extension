import { Serializer } from "@vue-lang/serialization";
import { Move, Enum } from "@vue-lang/serialization";

@Move()
export class EditorOptions extends Serializer implements ts.EditorSettings {
    @Move(Number, true) baseIndentSize?: number;
    @Move(Number) indentSize?: number;
    @Move(Number) tabSize?: number;
    @Move(String) newLineCharacter?: string;
    @Move(Boolean) convertTabsToSpaces?: boolean;
    @Move(Enum) indentStyle?: ts.IndentStyle;
}