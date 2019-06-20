import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class JSDocTagInfo extends Serializer implements ts.JSDocTagInfo {
    @Move(String) name: string;
    @Move(String, true) text?: string;
}