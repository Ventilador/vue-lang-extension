import { TextSpan } from "./textSpan";
import { Move, Enum } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";


@Move()
export class OutliningSpan extends Serializer implements ts.OutliningSpan {
    @Move(TextSpan) textSpan: TextSpan;
    @Move(TextSpan) hintSpan: TextSpan;
    @Move(String) bannerText: string;
    @Move(Boolean) autoCollapse: boolean;
    @Move(Enum) kind: ts.OutliningSpanKind;
}