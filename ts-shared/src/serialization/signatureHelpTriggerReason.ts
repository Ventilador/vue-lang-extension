import { Serializer } from "@vue-lang/serialization";
import { Move } from "@vue-lang/serialization";

@Move()
export class SignatureHelpTriggerReason extends Serializer {
    @Move(String) kind: string;
    @Move(String, true) triggerCharacter?: string;
}