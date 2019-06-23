import './logger';
import * as tsLib from 'typescript/lib/tsserverlibrary';
import { join } from 'path';
import { LanguageService, server } from 'typescript/lib/tsserverlibrary';
import { createUtils } from "./cache";
import { wrapFsMethods } from './createFsMethodWrappers';
import { applyCodeActionCommandFactory } from './methods/applyCodeActionCommand';
import { findReferencesFactory } from "./methods/findReferences";
import { findRenameLocationsFactory } from "./methods/findRenameLocations";
import { getApplicableRefactorsFactory } from "./methods/getApplicableRefactors";
import { getBraceMatchingAtPositionFactory } from "./methods/getBraceMatchingAtPosition";
import { getBreakpointStatementAtPositionFactory } from "./methods/getBreakpointStatementAtPosition";
import { getCodeFixesAtPositionFactory } from "./methods/getCodeFixesAtPosition";
import { getCombinedCodeFixFactory } from "./methods/getCombinedCodeFix";
import { getCompletionEntryDetailsFactory } from './methods/getCompletionEntryDetails';
import { getCompletionEntrySymbolFactory } from './methods/getCompletionEntrySymbol';
import { getCompletionsAtPositionFactory } from './methods/getCompletionsAtPosition';
import { getDefinitionAndBoundSpanFactory } from './methods/getDefinitionAndBoundSpan';
import { getDefinitionAtPositionFactory } from "./methods/getDefinitionAtPosition";
import { getDocCommentTemplateAtPositionFactory } from './methods/getDocCommentTemplateAtPosition';
import { getDocumentHighlightsFactory } from './methods/getDocumentHighlights';
import { getEditsForFileRenameFactory } from './methods/getEditsForFileRename';
import { getEditsForRefactorFactory } from './methods/getEditsForRefactor';
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
import { getNavigationBarItemsFactory } from './methods/getNavigationBarItems';
import { getNavigationTreeFactory } from './methods/getNavigationTree';
import { getNonBoundSourceFileFactory } from './methods/getNonBoundSourceFile';
import { getOccurrencesAtPositionFactory } from './methods/getOccurrencesAtPosition';
import { getOutliningSpansFactory } from './methods/getOutliningSpans';
import { getQuickInfoAtPositionFactory } from './methods/getQuickInfoAtPosition';
import { getReferencesAtPositionFactory } from './methods/getReferencesAtPosition';
import { getRenameInfoFactory } from './methods/getRenameInfo';
import { getSemanticClassificationsFactory } from './methods/getSemanticClassifications';
import { getSemanticDiagnosticsFactory } from './methods/getSemanticDiagnostics';
import { getSignatureHelpItemsFactory } from './methods/getSignatureHelpItems';
import { getSmartSelectionRangeFactory } from './methods/getSmartSelectionRange';
import { getSourceMapperFactory } from './methods/getSourceMapper';
import { getSpanOfEnclosingCommentFactory } from './methods/getSpanOfEnclosingComment';
import { getSuggestionDiagnosticsFactory } from './methods/getSuggestionDiagnostics';
import { getSyntacticClassificationsFactory } from './methods/getSyntacticClassifications';
import { getSyntacticDiagnosticsFactory } from "./methods/getSyntacticDiagnostics";
import { getTodoCommentsFactory } from './methods/getTodoComments';
import { getTypeDefinitionAtPositionFactory } from './methods/getTypeDefinitionAtPosition';
import { isValidBraceCompletionAtPositionFactory } from './methods/isValidBraceCompletionAtPosition';
import { organizeImportsFactory } from './methods/organizeImports';
import { toLineColumnOffsetFactory } from './methods/toLineColumnOffset';
import { createMappers } from './transformers';
import { patchProject } from './patchProject';

export = function init({ typescript: ts }: { typescript: typeof tsLib }): server.PluginModule {
    return {
        create: function (info: server.PluginCreateInfo): LanguageService {
            const utils = createUtils(info, ts.server);
            wrapFsMethods(info.serverHost, utils);
            wrapFsMethods(info.languageServiceHost, utils);
            const mappers = createMappers(utils);
            const { languageService } = info;
            patchProject(info.project, utils, mappers);
            return Object.keys(languageService).reduce((prev: any, cur) => {
                if (MethodFactories[cur + 'Factory']) {
                    prev[cur] = MethodFactories[cur + 'Factory'](languageService, utils, mappers);
                } else {
                    prev[cur] = (languageService as any)[cur];
                }
                return prev;
            }, {}) as LanguageService;
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
                getCompilerOptionsDiagnostics: languageService.getCompilerOptionsDiagnostics,
                cleanupSemanticCache: languageService.cleanupSemanticCache,
                dispose: languageService.dispose,
                getProgram: languageService.getProgram,
            } as any;
        }
    }
}
const MethodNames = [
    'applyCodeActionCommand',
    'findReferences',
    'getDefinitionAtPosition',
    'getSyntacticDiagnostics',
    'getApplicableRefactors',
    'findRenameLocations',
    'getBraceMatchingAtPosition',
    'getBreakpointStatementAtPosition',
    'getCodeFixesAtPosition',
    'getCombinedCodeFix',
    'getCompletionEntryDetails',
    'getCompletionEntrySymbol',
    'getCompletionsAtPosition',
    'getDefinitionAndBoundSpan',
    'getDocCommentTemplateAtPosition',
    'getDocumentHighlights',
    'getEditsForFileRename',
    'getEditsForRefactor',
    'getEmitOutput',
    'getEncodedSemanticClassifications',
    'getEncodedSyntacticClassifications',
    'getFormattingEditsAfterKeystroke',
    'getFormattingEditsForDocument',
    'getFormattingEditsForRange',
    'getImplementationAtPosition',
    'getIndentationAtPosition',
    'getJsxClosingTagAtPosition',
    'getNameOrDottedNameSpan',
    'getNavigateToItems',
    'getNavigationTree',
    'getOccurrencesAtPosition',
    'getOutliningSpans',
    'getQuickInfoAtPosition',
    'getReferencesAtPosition',
    'getRenameInfo',
    'getSemanticClassifications',
    'getSemanticDiagnostics',
    'getSignatureHelpItems',
    'getSmartSelectionRange',
    'getSpanOfEnclosingComment',
    'getSuggestionDiagnostics',
    'getSyntacticClassifications',
    'getTodoComments',
    'getTypeDefinitionAtPosition',
    'isValidBraceCompletionAtPosition',
    'organizeImports',
    'toLineColumnOffset',
    'getNavigationBarItems',
    'getNonBoundSourceFile',
    'getSourceMapper',
    'getCompilerOptionsDiagnostics',
    'cleanupSemanticCache',
    'dispose',
    'getProgram',
];
const MethodFactories = [
    applyCodeActionCommandFactory,
    findReferencesFactory,
    getDefinitionAtPositionFactory,
    getSyntacticDiagnosticsFactory,
    getApplicableRefactorsFactory,
    findRenameLocationsFactory,
    getBraceMatchingAtPositionFactory,
    getBreakpointStatementAtPositionFactory,
    getCodeFixesAtPositionFactory,
    getCombinedCodeFixFactory,
    getCompletionEntryDetailsFactory,
    getCompletionEntrySymbolFactory,
    getCompletionsAtPositionFactory,
    getDefinitionAndBoundSpanFactory,
    getDocCommentTemplateAtPositionFactory,
    getDocumentHighlightsFactory,
    getEditsForFileRenameFactory,
    getEditsForRefactorFactory,
    getEmitOutputFactory,
    getEncodedSemanticClassificationsFactory,
    getEncodedSyntacticClassificationsFactory,
    getFormattingEditsAfterKeystrokeFactory,
    getFormattingEditsForDocumentFactory,
    getFormattingEditsForRangeFactory,
    getImplementationAtPositionFactory,
    getIndentationAtPositionFactory,
    getJsxClosingTagAtPositionFactory,
    getNameOrDottedNameSpanFactory,
    getNavigateToItemsFactory,
    getNavigationTreeFactory,
    getOccurrencesAtPositionFactory,
    getOutliningSpansFactory,
    getQuickInfoAtPositionFactory,
    getReferencesAtPositionFactory,
    getRenameInfoFactory,
    getSemanticClassificationsFactory,
    getSemanticDiagnosticsFactory,
    getSignatureHelpItemsFactory,
    getSmartSelectionRangeFactory,
    getSpanOfEnclosingCommentFactory,
    getSuggestionDiagnosticsFactory,
    getSyntacticClassificationsFactory,
    getTodoCommentsFactory,
    getTypeDefinitionAtPositionFactory,
    isValidBraceCompletionAtPositionFactory,
    organizeImportsFactory,
    toLineColumnOffsetFactory,
    getNavigationBarItemsFactory,
    getNonBoundSourceFileFactory,
    getSourceMapperFactory,
].reduce((prev, cur) => {
    prev[cur.name] = cur;
    return prev;
}, Object.create(null) as Record<string, Function>);
const patched = Symbol('patched');
function patch<T>(val: T): T {
    (val as any)[patched] = true;
    return val;
}
function isPatched(val: any): boolean {
    return !!val[patched];
}
