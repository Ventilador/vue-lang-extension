import { SymbolDisplayPart } from "./symbolDisplayPart";
import { Move, Serializer } from "@vue-lang/serialization";

@Move()
export class SignatureHelpParameter extends Serializer implements ts.SignatureHelpParameter {
    @Move(String) name: string;
    @Move([SymbolDisplayPart]) documentation: SymbolDisplayPart[];
    @Move([SymbolDisplayPart]) displayParts: SymbolDisplayPart[];
    @Move(Boolean) isOptional: boolean;
}