import { FileTextChanges } from "./fileTextChanges";
import { Move, Serializer } from "@vue-lang/serialization";
import { CodeActionCommand } from './codeActionCommand';

@Move()
export class CombinedCodeActions extends Serializer implements ts.CombinedCodeActions {
    @Move([FileTextChanges]) changes: ReadonlyArray<FileTextChanges>;
    @Move(CodeActionCommand) commands?: ReadonlyArray<ts.CodeActionCommand>;
}