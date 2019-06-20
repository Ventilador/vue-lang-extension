import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class CombinedCodeFixScope extends Serializer implements ts.CombinedCodeFixScope {
    @Move(String) type: "file";
    @Move(String) fileName: string;
}