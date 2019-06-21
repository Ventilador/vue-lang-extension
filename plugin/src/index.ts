import { server, LanguageService, sys } from 'typescript/lib/tsserverlibrary';
import { createUtils, Utils } from "./cache";
import { findReferencesFactory } from "./methods/findReferences";
import { getDefinitionAtPositionFactory } from "./methods/getDefinitionAtPosition";
import { getSyntacticDiagnosticsFactory } from "./methods/getSyntacticDiagnostics";
import { getApplicableRefactorsFactory } from "./methods/getApplicableRefactors";
import { findRenameLocationsFactory } from "./methods/findRenameLocations";
import { getBraceMatchingAtPositionFactory } from "./methods/getBraceMatchingAtPosition";
import { getBreakpointStatementAtPositionFactory } from "./methods/getBreakpointStatementAtPosition";
import { getCodeFixesAtPositionFactory } from "./methods/getCodeFixesAtPosition";
import { getCombinedCodeFixFactory } from "./methods/getCombinedCodeFix";
import { getCompletionEntryDetailsFactory } from './methods/getCompletionEntryDetails';
import { getCompletionEntrySymbolFactory } from './methods/getCompletionEntrySymbol';
import { getCompletionsAtPositionFactory } from './methods/getCompletionsAtPosition';
import { getDefinitionAndBoundSpanFactory } from './methods/getDefinitionAndBoundSpan';
import { getDocCommentTemplateAtPositionFactory } from './methods/getDocCommentTemplateAtPosition';
import { getDocumentHighlightsFactory } from './methods/getDocumentHighlights';
import { getEditsForRefactorFactory } from './methods/getEditsForRefactor';
import { getEditsForFileRenameFactory } from './methods/getEditsForFileRename';
import { getEmitOutputFactory } from './methods/getEmitOutput';
import { getEncodedSemanticClassificationsFactory } from './methods/getEncodedSemanticClassifications';
import { getEncodedSyntacticClassificationsFactory } from './methods/getEncodedSyntacticClassifications';
import { getFormattingEditsAfterKeystrokeFactory } from './methods/getFormattingEditsAfterKeystroke';
import { getFormattingEditsForDocumentFactory } from './methods/getFormattingEditsForDocument';
import { getFormattingEditsForRangeFactory } from './methods/getFormattingEditsForRange';
import { getImplementationAtPositionFactory } from './methods/getImplementationAtPosition';
import { getIndentationAtPositionFactory } from './methods/getIndentationAtPosition';
import { getJsxClosingTagAtPositionFactory } from './methods/getJsxClosingTagAtPosition';
import { getNameOrDottedNameSpanFactory } from './methods/getNameOrDottedNameSpan';
import { getNavigateToItemsFactory } from './methods/getNavigateToItems';
import { getNavigationTreeFactory } from './methods/getNavigationTree';
import { getOccurrencesAtPositionFactory } from './methods/getOccurrencesAtPosition';
import { getOutliningSpansFactory } from './methods/getOutliningSpans';
import { getQuickInfoAtPositionFactory } from './methods/getQuickInfoAtPosition';
import { getReferencesAtPositionFactory } from './methods/getReferencesAtPosition';
import { getRenameInfoFactory } from './methods/getRenameInfo';
import { getSemanticClassificationsFactory } from './methods/getSemanticClassifications';
import { getSemanticDiagnosticsFactory } from './methods/getSemanticDiagnostics';
import { getSignatureHelpItemsFactory } from './methods/getSignatureHelpItems';
import { getSmartSelectionRangeFactory } from './methods/getSmartSelectionRange';
import { getSpanOfEnclosingCommentFactory } from './methods/getSpanOfEnclosingComment';
import { getSuggestionDiagnosticsFactory } from './methods/getSuggestionDiagnostics';
import { getSyntacticClassificationsFactory } from './methods/getSyntacticClassifications';
import { getTodoCommentsFactory } from './methods/getTodoComments';
import { getTypeDefinitionAtPositionFactory } from './methods/getTypeDefinitionAtPosition';
import { isValidBraceCompletionAtPositionFactory } from './methods/isValidBraceCompletionAtPosition';
import { organizeImportsFactory } from './methods/organizeImports';
import { toLineColumnOffsetFactory } from './methods/toLineColumnOffset';
import { applyCodeActionCommandFactory } from './methods/applyCodeActionCommand';
import { createMappers } from './transformers';
import { getNavigationBarItemsFactory } from './methods/getNavigationBarItems';
import { join } from 'path';
import { getNonBoundSourceFileFactory } from './methods/getNonBoundSourceFile';
import { getSourceMapperFactory } from './methods/getSourceMapper';
import { wrapFsMethods } from './createFsMethodWrappers';
let cachedPlugin: server.PluginModule | undefined;

export = function init(): server.PluginModule {
    return cachedPlugin = {
        create: function (info: server.PluginCreateInfo): LanguageService {
            const utils = createUtils(info);
            wrapFsMethods(info.serverHost, utils);
            wrapFsMethods(info.languageServiceHost, utils);
            const mappers = createMappers(utils);
            info.project.addRoot
            const { languageService } = info;
            return {
                applyCodeActionCommand: applyCodeActionCommandFactory(languageService, utils, mappers),
                findReferences: findReferencesFactory(languageService, utils, mappers),
                getDefinitionAtPosition: getDefinitionAtPositionFactory(languageService, utils, mappers),
                getSyntacticDiagnostics: getSyntacticDiagnosticsFactory(languageService, utils, mappers),
                getApplicableRefactors: getApplicableRefactorsFactory(languageService, utils, mappers),
                findRenameLocations: findRenameLocationsFactory(languageService, utils, mappers),
                getBraceMatchingAtPosition: getBraceMatchingAtPositionFactory(languageService, utils, mappers),
                getBreakpointStatementAtPosition: getBreakpointStatementAtPositionFactory(languageService, utils, mappers),
                getCodeFixesAtPosition: getCodeFixesAtPositionFactory(languageService, utils, mappers),
                getCombinedCodeFix: getCombinedCodeFixFactory(languageService, utils, mappers),
                getCompletionEntryDetails: getCompletionEntryDetailsFactory(languageService, utils, mappers),
                getCompletionEntrySymbol: getCompletionEntrySymbolFactory(languageService, utils, mappers),
                getCompletionsAtPosition: getCompletionsAtPositionFactory(languageService, utils, mappers),
                getDefinitionAndBoundSpan: getDefinitionAndBoundSpanFactory(languageService, utils, mappers),
                getDocCommentTemplateAtPosition: getDocCommentTemplateAtPositionFactory(languageService, utils, mappers),
                getDocumentHighlights: getDocumentHighlightsFactory(languageService, utils, mappers),
                getEditsForFileRename: getEditsForFileRenameFactory(languageService, utils, mappers),
                getEditsForRefactor: getEditsForRefactorFactory(languageService, utils, mappers),
                getEmitOutput: getEmitOutputFactory(languageService, utils, mappers),
                getEncodedSemanticClassifications: getEncodedSemanticClassificationsFactory(languageService, utils, mappers),
                getEncodedSyntacticClassifications: getEncodedSyntacticClassificationsFactory(languageService, utils, mappers),
                getFormattingEditsAfterKeystroke: getFormattingEditsAfterKeystrokeFactory(languageService, utils, mappers),
                getFormattingEditsForDocument: getFormattingEditsForDocumentFactory(languageService, utils, mappers),
                getFormattingEditsForRange: getFormattingEditsForRangeFactory(languageService, utils, mappers),
                getImplementationAtPosition: getImplementationAtPositionFactory(languageService, utils, mappers),
                getIndentationAtPosition: getIndentationAtPositionFactory(languageService, utils, mappers),
                getJsxClosingTagAtPosition: getJsxClosingTagAtPositionFactory(languageService, utils, mappers),
                getNameOrDottedNameSpan: getNameOrDottedNameSpanFactory(languageService, utils, mappers),
                getNavigateToItems: getNavigateToItemsFactory(languageService, utils, mappers),
                getNavigationTree: getNavigationTreeFactory(languageService, utils, mappers),
                getOccurrencesAtPosition: getOccurrencesAtPositionFactory(languageService, utils, mappers),
                getOutliningSpans: getOutliningSpansFactory(languageService, utils, mappers),
                getQuickInfoAtPosition: getQuickInfoAtPositionFactory(languageService, utils, mappers),
                getReferencesAtPosition: getReferencesAtPositionFactory(languageService, utils, mappers),
                getRenameInfo: getRenameInfoFactory(languageService, utils, mappers),
                getSemanticClassifications: getSemanticClassificationsFactory(languageService, utils, mappers),
                getSemanticDiagnostics: getSemanticDiagnosticsFactory(languageService, utils, mappers),
                getSignatureHelpItems: getSignatureHelpItemsFactory(languageService, utils, mappers),
                getSmartSelectionRange: getSmartSelectionRangeFactory(languageService, utils, mappers),
                getSpanOfEnclosingComment: getSpanOfEnclosingCommentFactory(languageService, utils, mappers),
                getSuggestionDiagnostics: getSuggestionDiagnosticsFactory(languageService, utils, mappers),
                getSyntacticClassifications: getSyntacticClassificationsFactory(languageService, utils, mappers),
                getTodoComments: getTodoCommentsFactory(languageService, utils, mappers),
                getTypeDefinitionAtPosition: getTypeDefinitionAtPositionFactory(languageService, utils, mappers),
                isValidBraceCompletionAtPosition: isValidBraceCompletionAtPositionFactory(languageService, utils, mappers),
                organizeImports: organizeImportsFactory(languageService, utils, mappers),
                toLineColumnOffset: toLineColumnOffsetFactory(languageService, utils, mappers),
                getNavigationBarItems: getNavigationBarItemsFactory(languageService, utils, mappers),
                getNonBoundSourceFile: getNonBoundSourceFileFactory(languageService, utils, mappers),
                getSourceMapper: getSourceMapperFactory(languageService, utils, mappers),
                getCompilerOptionsDiagnostics: languageService.getCompilerOptionsDiagnostics.bind(languageService),
                cleanupSemanticCache: languageService.cleanupSemanticCache.bind(languageService),
                dispose: languageService.dispose.bind(languageService),
                getProgram: languageService.getProgram.bind(languageService),
            } as any;
        },
        getExternalFiles(proj: server.Project) {
            const curDir = proj.getCurrentDirectory();
            const result = sys.readDirectory(curDir, ['.vue'], [], [join(curDir, '**/*.vue')]);
            const found = new Set(proj.getFileNames().filter(i => i.endsWith('.vue')));
            result.forEach(i => {
                const path = server.asNormalizedPath(i);
                if (found.has(path)) {
                    return;
                }

                proj.addMissingFileRoot(path);
            })
            // return result.filter(i => i.endsWith('.vue.ts'));
            return [];
        }
    }
}
// interface LanguageService {
//     getSyntacticDiagnostics(fileName: string): DiagnosticWithLocation[];
//     getSemanticDiagnostics(fileName: string): Diagnostic[];
//     getSuggestionDiagnostics(fileName: string): DiagnosticWithLocation[];
//     getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
//     getSemanticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
//     getEncodedSyntacticClassifications(fileName: string, span: TextSpan): Classifications;
//     getEncodedSemanticClassifications(fileName: string, span: TextSpan): Classifications;
//     getCompletionsAtPosition(fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): WithMetadata<CompletionInfo> | undefined;
//     getCompletionEntryDetails(fileName: string, position: number, name: string, formatOptions: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined, preferences: UserPreferences | undefined): CompletionEntryDetails | undefined;
//     getCompletionEntrySymbol(fileName: string, position: number, name: string, source: string | undefined): Symbol | undefined;
//     getQuickInfoAtPosition(fileName: string, position: number): QuickInfo | undefined;
//     getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): TextSpan | undefined;
//     getBreakpointStatementAtPosition(fileName: string, position: number): TextSpan | undefined;
//     getSignatureHelpItems(fileName: string, position: number, options: SignatureHelpItemsOptions | undefined): SignatureHelpItems | undefined;
//     getRenameInfo(fileName: string, position: number, options?: RenameInfoOptions): RenameInfo;
//     findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean, providePrefixAndSuffixTextForRename?: boolean): ReadonlyArray<RenameLocation> | undefined;
//     getSmartSelectionRange(fileName: string, position: number): SelectionRange;
//     getDefinitionAtPosition(fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined;
//     getDefinitionAndBoundSpan(fileName: string, position: number): DefinitionInfoAndBoundSpan | undefined;
//     getTypeDefinitionAtPosition(fileName: string, position: number): ReadonlyArray<DefinitionInfo> | undefined;
//     getImplementationAtPosition(fileName: string, position: number): ReadonlyArray<ImplementationLocation> | undefined;
//     getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[] | undefined;
//     findReferences(fileName: string, position: number): ReferencedSymbol[] | undefined;
//     getDocumentHighlights(fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[] | undefined;
//     /** @deprecated */
//     getOccurrencesAtPosition(fileName: string, position: number): ReadonlyArray<ReferenceEntry> | undefined;
//     getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string, excludeDtsFiles?: boolean): NavigateToItem[];
//     getNavigationBarItems(fileName: string): NavigationBarItem[];
//     getNavigationTree(fileName: string): NavigationTree;
//     getOutliningSpans(fileName: string): OutliningSpan[];
//     getTodoComments(fileName: string, descriptors: TodoCommentDescriptor[]): TodoComment[];
//     getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
//     getIndentationAtPosition(fileName: string, position: number, options: EditorOptions | EditorSettings): number;
//     getFormattingEditsForRange(fileName: string, start: number, end: number, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
//     getFormattingEditsForDocument(fileName: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
//     getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
//     getDocCommentTemplateAtPosition(fileName: string, position: number): TextInsertion | undefined;
//     isValidBraceCompletionAtPosition(fileName: string, position: number, openingBrace: number): boolean;
//     getJsxClosingTagAtPosition(fileName: string, position: number): JsxClosingTagInfo | undefined;
//     getSpanOfEnclosingComment(fileName: string, position: number, onlyMultiLine: boolean): TextSpan | undefined;
//     toLineColumnOffset?(fileName: string, position: number): LineAndCharacter;
//     getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: ReadonlyArray<number>, formatOptions: FormatCodeSettings, preferences: UserPreferences): ReadonlyArray<CodeFixAction>;
//     getCombinedCodeFix(scope: CombinedCodeFixScope, fixId: {}, formatOptions: FormatCodeSettings, preferences: UserPreferences): CombinedCodeActions;
//     applyCodeActionCommand(action: CodeActionCommand, formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult>;
//     applyCodeActionCommand(action: CodeActionCommand[], formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult[]>;
//     applyCodeActionCommand(action: CodeActionCommand | CodeActionCommand[], formatSettings?: FormatCodeSettings): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
//     /** @deprecated `fileName` will be ignored */
//     applyCodeActionCommand(fileName: string, action: CodeActionCommand): Promise<ApplyCodeActionCommandResult>;
//     /** @deprecated `fileName` will be ignored */
//     applyCodeActionCommand(fileName: string, action: CodeActionCommand[]): Promise<ApplyCodeActionCommandResult[]>;
//     /** @deprecated `fileName` will be ignored */
//     applyCodeActionCommand(fileName: string, action: CodeActionCommand | CodeActionCommand[]): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
//     getApplicableRefactors(fileName: string, positionOrRange: number | TextRange, preferences: UserPreferences | undefined): ApplicableRefactorInfo[];
//     getEditsForRefactor(fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string, preferences: UserPreferences | undefined): RefactorEditInfo | undefined;
//     organizeImports(scope: OrganizeImportsScope, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges>;
//     getEditsForFileRename(oldFilePath: string, newFilePath: string, formatOptions: FormatCodeSettings, preferences: UserPreferences | undefined): ReadonlyArray<FileTextChanges>;
//     getEmitOutput(fileName: string, emitOnlyDtsFiles?: boolean): EmitOutput;
// }


