import { TextSpan } from "./textSpan";
import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class NavigationBarItem extends Serializer implements ts.NavigationBarItem {
    @Move(String) text: string;
    @Move(String) kind: ts.ScriptElementKind;
    @Move(String) kindModifiers: string;
    @Move([TextSpan]) spans: TextSpan[];
    @Move([NavigationBarItem]) childItems: NavigationBarItem[];
    @Move(Number) indent: number;
    @Move(Boolean) bolded: boolean;
    @Move(Boolean) grayed: boolean;
}