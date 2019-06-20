import { TextSpan } from "./textSpan";
import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class DocumentSpan extends Serializer implements ts.DocumentSpan {
    @Move(TextSpan) textSpan: TextSpan;
    @Move(String) fileName: string;
    @Move(TextSpan, true) originalTextSpan?: TextSpan;
    @Move(String, true) originalFileName?: string;
    something() {

    }
}
