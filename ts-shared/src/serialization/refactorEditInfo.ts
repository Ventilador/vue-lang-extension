import { Serializer } from "@vue-lang/serialization";
import { FileTextChanges } from "./fileTextChanges";
import { CodeActionCommand } from './codeActionCommand'
import { Move } from "@vue-lang/serialization";

@Move()
export class RefactorEditInfo extends Serializer implements ts.RefactorEditInfo {
    @Move([FileTextChanges]) edits: FileTextChanges[];
    @Move(String) renameFilename?: string;
    @Move(Number, true) renameLocation?: number;
    @Move([CodeActionCommand], true) commands?: ts.CodeActionCommand[];
}