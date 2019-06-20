import { Move, Serializer } from "@vue-lang/serialization";
import { TextChange } from "./textChange";

@Move()
export class FileTextChanges extends Serializer implements ts.FileTextChanges {
    @Move(String) fileName: string;
    @Move([TextChange]) textChanges: TextChange[];
    @Move(Boolean, true) isNewFile?: boolean;
}