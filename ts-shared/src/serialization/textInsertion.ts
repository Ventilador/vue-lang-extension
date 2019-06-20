import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class TextInsertion extends Serializer implements ts.TextInsertion {
    @Move(String) newText: string;
    @Move(Number) caretOffset: number;
}