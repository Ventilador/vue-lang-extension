import { Serializer } from "@vue-lang/serialization";
import { Move } from "@vue-lang/serialization";
@Move()
export class RefactorActionInfo extends Serializer implements ts.RefactorActionInfo {
    @Move(String) name: string;
    @Move(String) description: string;
}