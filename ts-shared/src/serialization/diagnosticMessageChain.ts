import { Serializer } from "@vue-lang/serialization";
import { Move } from "@vue-lang/serialization";

@Move()
export class DiagnosticMessageChain extends Serializer implements ts.DiagnosticMessageChain {
    @Move(String) messageText: string;
    @Move(Number) category: ts.DiagnosticCategory;
    @Move(Number) code: number;
    @Move(DiagnosticMessageChain, true) next?: ts.DiagnosticMessageChain;
}