import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class Classifications extends Serializer implements ts.Classifications {
    @Move([Number]) spans: number[];
    @Move(Number) endOfLineState: ts.EndOfLineState;
}