import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class ApplyCodeActionCommandResult extends Serializer implements ts.ApplyCodeActionCommandResult {
    @Move(String) successMessage: string;
}