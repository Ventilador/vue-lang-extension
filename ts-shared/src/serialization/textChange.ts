import { TextSpan } from "./textSpan";
import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class TextChange extends Serializer implements ts.TextChange {
    @Move(TextSpan) span: TextSpan;
    @Move(String) newText: string;
}