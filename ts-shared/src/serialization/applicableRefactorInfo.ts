import { Move } from "@vue-lang/serialization";
import { RefactorActionInfo } from "./refactorActionInfo";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class ApplicableRefactorInfo extends Serializer implements ts.ApplicableRefactorInfo {
    @Move(String) name: string;
    @Move(String) description: string;
    @Move(Boolean, true) inlineable?: boolean;
    @Move([RefactorActionInfo]) actions: RefactorActionInfo[];
}