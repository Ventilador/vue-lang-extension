import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class JsxClosingTagInfo extends Serializer implements ts.JsxClosingTagInfo {
    @Move(String) readonly newText: string;
}