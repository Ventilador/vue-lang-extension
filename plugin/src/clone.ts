import { DiagnosticWithLocation } from "typescript/lib/tsserverlibrary";

export function cloneDiagnosticWithLocation(diags: DiagnosticWithLocation): DiagnosticWithLocation {
    return {
        category: diags.category,
        code: diags.code,
        file: diags.file,
        length: diags.length,
        messageText: diags.messageText,
        relatedInformation: diags.relatedInformation,
        reportsUnnecessary: diags.reportsUnnecessary,
        source: diags.source,
        start: diags.start,
    }
}