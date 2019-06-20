import { Move, Enum } from "@vue-lang/serialization";
import { TextSpan } from "./textSpan";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class ClassifiedSpan extends Serializer implements ts.ClassifiedSpan {
    @Move(TextSpan) textSpan: TextSpan;
    @Move(Enum) classificationType: ts.ClassificationTypeNames;
}