import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";
import { FileTextChanges } from "./fileTextChanges";

@Move()
export class CodeAction extends Serializer implements ts.CodeAction {
    @Move(String) description: string;
    @Move([FileTextChanges]) changes: FileTextChanges[];
    @Move(Object, true) commands?: ts.CodeActionCommand[];
}