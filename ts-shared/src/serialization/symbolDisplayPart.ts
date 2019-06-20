import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";
@Move()
export class SymbolDisplayPart extends Serializer implements ts.SymbolDisplayPart {
    @Move(String) text: string;
    @Move(String) kind: string;
}

