import { Move } from "@vue-lang/serialization";
import { DefinitionInfo } from "./definitionInfo";
import { TextSpan } from "./textSpan";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class DefinitionInfoAndBoundSpan extends Serializer implements ts.DefinitionInfoAndBoundSpan {
    @Move([DefinitionInfo], true) definitions?: ReadonlyArray<DefinitionInfo>;
    @Move(TextSpan) textSpan: TextSpan;
}