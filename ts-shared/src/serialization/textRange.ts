import { Serializer } from "@vue-lang/serialization";
import { Move } from "@vue-lang/serialization";

@Move()
export class TextRange extends Serializer implements ts.TextRange {
    @Move(Number) pos: number;
    @Move(Number) end: number;
}