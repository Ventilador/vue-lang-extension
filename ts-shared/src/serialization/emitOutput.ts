import { Serializer } from "@vue-lang/serialization";
import { OutputFile } from "./outputFile";
import { Move } from "@vue-lang/serialization";

@Move()
export class EmitOutput extends Serializer implements ts.EmitOutput {
    @Move([OutputFile]) outputFiles: OutputFile[];
    @Move(Boolean) emitSkipped: boolean;
}