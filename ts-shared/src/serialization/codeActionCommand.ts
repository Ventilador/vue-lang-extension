import { Serializer, Move, Reader, FullJson } from "@vue-lang/serialization";

@Move()
export class CodeActionCommand {
    static parse(reader: Reader) {
        return FullJson.parse(reader);
    }
    static stringify(val: any) {
        return FullJson.stringify(val);
    }
};