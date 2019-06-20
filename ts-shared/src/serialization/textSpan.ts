import { Serializer } from "@vue-lang/serialization";
import { Move } from "@vue-lang/serialization";

@Move()
export class TextSpan extends Serializer implements ts.TextSpan {
    @Move(Number) start: number;
    @Move(Number) length: number;
}