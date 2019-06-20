import { UserPreferences } from "./userPreferences";
import { Move } from "@vue-lang/serialization";

@Move()
export class GetCompletionsAtPositionOptions extends UserPreferences implements ts.GetCompletionsAtPositionOptions {
    @Move(String, true) triggerCharacter?: ts.CompletionsTriggerCharacter;
    @Move(Boolean, true) includeExternalModuleExports?: boolean;
    @Move(Boolean, true) includeInsertTextCompletions?: boolean;
}