import { Move, Enum } from "@vue-lang/serialization";
import { TextSpan } from "./textSpan";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class HighlightSpan extends Serializer implements ts.HighlightSpan {
    @Move(String, true) fileName?: string;
    @Move(Boolean, true) isInString?: true;
    @Move(TextSpan, true) textSpan: TextSpan;
    @Move(Enum, true) kind: ts.HighlightSpanKind;
}