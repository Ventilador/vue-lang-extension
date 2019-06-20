import { TextSpan } from "./textSpan";
import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class SelectionRange extends Serializer implements ts.SelectionRange {
    @Move(TextSpan) textSpan: TextSpan;
    @Move(SelectionRange, true) parent?: SelectionRange;
}