import { SignatureHelpTriggerReason } from "./signatureHelpTriggerReason";
import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class SignatureHelpItemsOptions extends Serializer {
    @Move(SignatureHelpTriggerReason, true) triggerReason?: SignatureHelpTriggerReason;
}