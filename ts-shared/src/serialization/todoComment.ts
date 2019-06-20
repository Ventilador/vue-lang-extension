import { TodoCommentDescriptor } from "./todoCommentDescriptor";
import { Move } from "@vue-lang/serialization";
import { Serializer } from "@vue-lang/serialization";

@Move()
export class TodoComment extends Serializer implements ts.TodoComment {
    @Move(TodoCommentDescriptor) descriptor: TodoCommentDescriptor;
    @Move(String) message: string;
    @Move(Number) position: number;
}