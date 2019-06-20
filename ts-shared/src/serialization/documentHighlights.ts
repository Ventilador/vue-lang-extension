import { Move } from "@vue-lang/serialization";
import { HighlightSpan } from "./highlightSpan";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class DocumentHighlights extends Serializer implements ts.DocumentHighlights {
    @Move(String) fileName: string;
    @Move([HighlightSpan]) highlightSpans: HighlightSpan[];
}