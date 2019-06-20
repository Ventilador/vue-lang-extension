import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class LineAndCharacter extends Serializer implements ts.LineAndCharacter {
    @Move(Number) line: number;
    @Move(Number) character: number;
}