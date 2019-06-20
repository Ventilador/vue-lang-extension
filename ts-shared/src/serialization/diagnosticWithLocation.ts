import { Move } from "@vue-lang/serialization";
import { Diagnostic } from "./diagnostic";

@Move()
export class DiagnosticWithLocation extends Diagnostic implements ts.DiagnosticWithLocation { }