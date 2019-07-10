import { server } from "typescript/lib/tsserverlibrary";
import { Utils } from "./utils";
const touched = Symbol('touched');
export function patchScriptInfo(scriptInfo: server.ScriptInfo, { shouldRemap, getLineAndChar }: Utils) {
    if (patched(scriptInfo)) {
        return;
    }
    touch(scriptInfo);
    const orig = scriptInfo.lineOffsetToPosition;
    scriptInfo.lineOffsetToPosition = function (line: number, offset: number) {
        if (shouldRemap(this.fileName)) {
            const result = getLineAndChar(this.fileName, {
                character: offset,
                line: line
            }, false);
            line = result.line;
            offset = result.character;
        }
        return orig.call(this, line, offset);
    }
}
function touch(val: any) {
    val[touched] = true;
}
function patched(val: any) {
    return val[touched];
}