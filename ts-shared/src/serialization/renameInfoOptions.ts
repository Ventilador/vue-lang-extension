import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class RenameInfoOptions extends Serializer implements ts.RenameInfoOptions {
    @Move(Boolean, true) readonly allowRenameOfImportPath?: boolean;
}