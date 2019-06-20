import { ReferenceEntry } from "./referenceEntry";
import { Move } from "@vue-lang/serialization";
import { ReferencedSymbolDefinitionInfo } from "./referencedSymbolDefinitionInfo";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class ReferencedSymbol extends Serializer implements ts.ReferencedSymbol {
    @Move(ReferencedSymbolDefinitionInfo) definition: ReferencedSymbolDefinitionInfo;
    @Move([ReferenceEntry]) references: ReferenceEntry[];
}