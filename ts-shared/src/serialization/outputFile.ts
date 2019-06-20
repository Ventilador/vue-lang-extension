import { Serializer } from "@vue-lang/serialization";
import { Move } from "@vue-lang/serialization";

@Move()
export class OutputFile extends Serializer implements ts.OutputFile {
    @Move(String) name: string;
    @Move(Boolean) writeByteOrderMark: boolean;
    @Move(String) text: string;
}