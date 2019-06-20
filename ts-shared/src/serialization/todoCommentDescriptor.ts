import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class TodoCommentDescriptor extends Serializer implements ts.TodoCommentDescriptor {
    @Move(String) text: string;
    @Move(Number) priority: number;
}