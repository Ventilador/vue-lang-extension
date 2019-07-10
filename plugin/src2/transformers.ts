import {
    ApplicableRefactorInfo, Classifications, ClassifiedSpan, CodeAction,
    CodeFixAction, CombinedCodeActions, CombinedCodeFixScope, CompletionEntry,
    CompletionEntryDetails, CompletionInfo, DefinitionInfo, DefinitionInfoAndBoundSpan,
    Diagnostic, DiagnosticWithLocation, DocumentHighlights, FileTextChanges,
    ImplementationLocation, JsxClosingTagInfo, LanguageService, LineAndCharacter,
    NavigateToItem, NavigationBarItem, NavigationTree, OutliningSpan, QuickInfo,
    RefactorEditInfo, ReferencedSymbol, ReferencedSymbolDefinitionInfo,
    ReferenceEntry, RenameInfo, RenameInfoFailure, RenameInfoSuccess, RenameLocation,
    SelectionRange, SignatureHelpItems, TextChange, TextInsertion, TextRange,
    TextSpan, TodoComment, WithMetadata
} from 'typescript/lib/tsserverlibrary';
import { Utils } from './cache';
export const enter: Record<ArgumentName, EnterFunction> = {};
export const exit: Record<MethodName, ExitFunction> = {};
export type ArgumentName = string;
export type MethodName = string;
export type EnterFunction = (name: ArgumentName, args: any[], argumentValue: any, calculatePosition: (fileName: string, position: number, positive?: boolean) => number) => any;
export type ExitFunction = (methodName: MethodName, calculatePosition: (fileName: string, position: number, positive?: boolean) => number, lang: LanguageService, ...args: any[]) => any;
export function getFileName(methodName: string, ...args: any[]) {
    return args[0];
}
/**
 * Make all properties in T readonly
 */
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
export type Callable<T, K> = {
    (file: string, value: T): K;
    (this: string, value: T, index: number, arr: T[]): K;
}
export interface Mappers {
    outImplementationLocation(file: string, value: ImplementationLocation): ImplementationLocation
    outImplementationLocation(this: string, value: ImplementationLocation, index: number, arr: readonly ImplementationLocation[]): ImplementationLocation;
    outFileTextChanges(file: string, value: FileTextChanges): FileTextChanges
    outFileTextChanges(this: string, value: FileTextChanges, index: number, arr: readonly FileTextChanges[]): FileTextChanges;
    outDiagnostic(file: string, value: Diagnostic): Diagnostic
    outDiagnostic(this: string, value: Diagnostic, index: number, arr: readonly Diagnostic[]): Diagnostic;
    inTextSpan(file: string, value: TextSpan): TextSpan
    inTextSpan(this: string, value: TextSpan, index: number, arr: readonly TextSpan[]): TextSpan;
    outRefactorEditInfo(file: string, value: RefactorEditInfo): RefactorEditInfo
    outRefactorEditInfo(this: string, value: RefactorEditInfo, index: number, arr: readonly RefactorEditInfo[]): RefactorEditInfo;
    outTextChange(file: string, value: TextChange): TextChange
    outTextChange(this: string, value: TextChange, index: number, arr: readonly TextChange[]): TextChange;
    inTextChange(file: string, value: TextChange): TextChange
    inTextChange(this: string, value: TextChange, index: number, arr: readonly TextChange[]): TextChange;
    outDocumentHighlights(file: string, value: DocumentHighlights): DocumentHighlights
    outDocumentHighlights(this: string, value: DocumentHighlights, index: number, arr: readonly DocumentHighlights[]): DocumentHighlights;
    outTextInsertion(file: string, value: TextInsertion): TextInsertion
    outTextInsertion(this: string, value: TextInsertion, index: number, arr: readonly TextInsertion[]): TextInsertion;
    outDefinitionInfoAndBoundSpan(file: string, value: DefinitionInfoAndBoundSpan): DefinitionInfoAndBoundSpan
    outDefinitionInfoAndBoundSpan(this: string, value: DefinitionInfoAndBoundSpan, index: number, arr: readonly DefinitionInfoAndBoundSpan[]): DefinitionInfoAndBoundSpan;
    outWithMetadataCompletionInfo(file: string, value: WithMetadata<CompletionInfo>): WithMetadata<CompletionInfo>
    outWithMetadataCompletionInfo(this: string, value: WithMetadata<CompletionInfo>, index: number, arr: readonly WithMetadata<CompletionInfo>[]): WithMetadata<CompletionInfo>;
    outCompletionEntryDetails(file: string, value: CompletionEntryDetails): CompletionEntryDetails
    outCompletionEntryDetails(this: string, value: CompletionEntryDetails, index: number, arr: readonly CompletionEntryDetails[]): CompletionEntryDetails;
    outCombinedCodeActions(file: string, value: CombinedCodeActions): CombinedCodeActions
    outCombinedCodeActions(this: string, value: CombinedCodeActions, index: number, arr: readonly CombinedCodeActions[]): CombinedCodeActions;
    inCombinedCodeFixScope(file: string, value: CombinedCodeFixScope): CombinedCodeFixScope
    inCombinedCodeFixScope(this: string, value: CombinedCodeFixScope, index: number, arr: readonly CombinedCodeFixScope[]): CombinedCodeFixScope;
    outTextSpan(file: string, value: TextSpan): TextSpan
    outTextSpan(this: string, value: TextSpan, index: number, arr: readonly TextSpan[]): TextSpan;
    outCodeFixAction(file: string, value: CodeFixAction): CodeFixAction
    outCodeFixAction(this: string, value: CodeFixAction, index: number, arr: readonly CodeFixAction[]): CodeFixAction;
    outApplicableRefactorInfo(file: string, value: ApplicableRefactorInfo): ApplicableRefactorInfo
    outApplicableRefactorInfo(this: string, value: ApplicableRefactorInfo, index: number, arr: readonly ApplicableRefactorInfo[]): ApplicableRefactorInfo;
    inNumberOrTextRange(file: string, value: number | TextRange): number | TextRange
    inNumberOrTextRange(this: string, value: number | TextRange, index: number, arr: readonly (number | TextRange)[]): number | TextRange;
    outRenameLocation(file: string, value: RenameLocation): RenameLocation
    outRenameLocation(this: string, value: RenameLocation, index: number, arr: readonly RenameLocation[]): RenameLocation;
    outDiagnosticWithLocation(file: string, value: DiagnosticWithLocation): DiagnosticWithLocation
    outDiagnosticWithLocation(this: string, value: DiagnosticWithLocation, index: number, arr: readonly DiagnosticWithLocation[]): DiagnosticWithLocation;
    outDefinitionInfo(file: string, value: DefinitionInfo): DefinitionInfo
    outDefinitionInfo(this: string, value: DefinitionInfo, index: number, arr: readonly DefinitionInfo[]): DefinitionInfo;
    outReferencedSymbol(file: string, value: ReferencedSymbol): ReferencedSymbol
    outReferencedSymbol(this: string, value: ReferencedSymbol, index: number, arr: readonly ReferencedSymbol[]): ReferencedSymbol;
    outReferenceEntry(file: string, value: ReferenceEntry): ReferenceEntry
    outReferenceEntry(this: string, value: ReferenceEntry, index: number, arr: readonly ReferenceEntry[]): ReferenceEntry;
    outLineAndCharacter(file: string, value: LineAndCharacter): LineAndCharacter
    outLineAndCharacter(this: string, value: LineAndCharacter, index: number, arr: readonly LineAndCharacter[]): LineAndCharacter;
    outTodoComment(file: string, value: TodoComment): TodoComment
    outTodoComment(this: string, value: TodoComment, index: number, arr: readonly TodoComment[]): TodoComment;
    outSelectionRange(file: string, value: SelectionRange): SelectionRange
    outSelectionRange(this: string, value: SelectionRange, index: number, arr: readonly SelectionRange[]): SelectionRange;
    outSignatureHelpItems(file: string, value: SignatureHelpItems): SignatureHelpItems
    outSignatureHelpItems(this: string, value: SignatureHelpItems, index: number, arr: readonly SignatureHelpItems[]): SignatureHelpItems;
    outClassifiedSpan(file: string, value: ClassifiedSpan): ClassifiedSpan
    outClassifiedSpan(this: string, value: ClassifiedSpan, index: number, arr: readonly ClassifiedSpan[]): ClassifiedSpan;
    outRenameInfoSuccess(file: string, value: RenameInfoSuccess): RenameInfoSuccess
    outRenameInfoSuccess(this: string, value: RenameInfoSuccess, index: number, arr: readonly RenameInfoSuccess[]): RenameInfoSuccess;
    outRenameInfoFail(file: string, value: RenameInfoFailure): RenameInfoFailure
    outRenameInfoFail(this: string, value: RenameInfoFailure, index: number, arr: readonly RenameInfoFailure[]): RenameInfoFailure;
    outRenameInfo(file: string, value: RenameInfo): RenameInfo
    outRenameInfo(this: string, value: RenameInfo, index: number, arr: readonly RenameInfo[]): RenameInfo;
    outQuickInfo(file: string, value: QuickInfo): QuickInfo
    outQuickInfo(this: string, value: QuickInfo, index: number, arr: readonly QuickInfo[]): QuickInfo;
    outOutliningSpan(file: string, value: OutliningSpan): OutliningSpan
    outOutliningSpan(this: string, value: OutliningSpan, index: number, arr: readonly OutliningSpan[]): OutliningSpan;
    outNavigationTree(file: string, value: NavigationTree): NavigationTree
    outNavigationTree(this: string, value: NavigationTree, index: number, arr: readonly NavigationTree[]): NavigationTree;
    outNavigationBarItem(file: string, value: NavigationBarItem): NavigationBarItem
    outNavigationBarItem(this: string, value: NavigationBarItem, index: number, arr: readonly NavigationBarItem[]): NavigationBarItem;
    outJsxClosingTagInfo(file: string, value: JsxClosingTagInfo): JsxClosingTagInfo
    outJsxClosingTagInfo(this: string, value: JsxClosingTagInfo, index: number, arr: readonly JsxClosingTagInfo[]): JsxClosingTagInfo;
    outNavigateToItem(file: string, value: NavigateToItem): NavigateToItem
    outNavigateToItem(this: string, value: NavigateToItem, index: number, arr: readonly NavigateToItem[]): NavigateToItem;
    outClassifications(file: string, value: Classifications): Classifications
    outClassifications(this: string, value: Classifications, index: number, arr: readonly Classifications[]): Classifications
    outCompletionEntry(file: string, val: CompletionEntry): CompletionEntry;
    outCompletionEntry(this: string, val: CompletionEntry, index: number, arr: readonly CompletionEntry[]): CompletionEntry;
    outCodeAction(file: string, val: CodeAction): CodeAction
    outCodeAction(this: string, val: CodeAction, index: number, arr: readonly CodeAction[]): CodeAction
}

export function createMappers({ fromTsPath, calculatePosition, synchronize, wasVueFile, getLineAndChar, isVueFile, toTsPath }: Utils): Mappers {
    const mappers: Mappers = {
        outCodeAction: wrapper(outCodeAction),
        outCompletionEntry: wrapper(outCompletionEntry),
        outImplementationLocation: wrapper(outImplementationLocation),
        outFileTextChanges: wrapper(outFileTextChanges),
        inTextSpan: wrapper(inTextSpan),
        outRefactorEditInfo: wrapper(outRefactorEditInfo),
        outTextChange: wrapper(outTextChange),
        inTextChange: wrapper(inTextChange),
        outDocumentHighlights: wrapper(outDocumentHighlights),
        outTextInsertion: wrapper(outTextInsertion),
        outDefinitionInfoAndBoundSpan: wrapper(outDefinitionInfoAndBoundSpan),
        outWithMetadataCompletionInfo: wrapper(outWithMetadataCompletionInfo),
        outCompletionEntryDetails: wrapper(outCompletionEntryDetails),
        outCombinedCodeActions: wrapper(outCombinedCodeActions),
        inCombinedCodeFixScope: wrapper(inCombinedCodeFixScope),
        outTextSpan: wrapper(outTextSpan),
        outCodeFixAction: wrapper(outCodeFixAction),
        outApplicableRefactorInfo: wrapper(outApplicableRefactorInfo),
        inNumberOrTextRange: wrapper(inNumberOrTextRange),
        outRenameLocation: wrapper(outRenameLocation),
        outDiagnosticWithLocation: wrapper(outDiagnosticWithLocation),
        outDefinitionInfo: wrapper(outDefinitionInfo),
        outReferencedSymbol: wrapper(outReferencedSymbol),
        outReferenceEntry: wrapper(outReferenceEntry),
        outLineAndCharacter: wrapper(outLineAndCharacter),
        outTodoComment: wrapper(outTodoComment),
        outSelectionRange: wrapper(outSelectionRange),
        outSignatureHelpItems: wrapper(outSignatureHelpItems),
        outClassifiedSpan: wrapper(outClassifiedSpan),
        outRenameInfoSuccess: wrapper(outRenameInfoSuccess),
        outRenameInfoFail: wrapper(outRenameInfoFail),
        outRenameInfo: wrapper(outRenameInfo),
        outQuickInfo: wrapper(outQuickInfo),
        outOutliningSpan: wrapper(outOutliningSpan),
        outNavigationTree: wrapper(outNavigationTree),
        outNavigationBarItem: wrapper(outNavigationBarItem),
        outJsxClosingTagInfo: wrapper(outJsxClosingTagInfo),
        outNavigateToItem: wrapper(outNavigateToItem),
        outClassifications: wrapper(outClassifications),
        outDiagnostic: wrapper(outDiagnostic),
    };

    return mappers;

    function wrapper<T, K>(fn: (file: string, value: T) => K): Callable<T, K> {
        return function (this: string, file: any, val: T) {
            try {
                if (arguments.length > 2) {
                    return fn(this, file);
                } else {
                    return fn(file, val);
                }
            } catch (err) {
                debugger;
                throw err;
            }
        } as any
    }

    function outImplementationLocation(file: string, val: ImplementationLocation): ImplementationLocation {
        return {
            displayParts: val.displayParts,
            fileName: val.fileName,
            kind: val.kind,
            originalFileName: val.originalFileName,
            originalTextSpan: val.originalTextSpan,
            textSpan: val.textSpan,
        }
    }

    function inTextSpan(file: string, val: TextSpan): TextSpan {
        return {
            length: val.length,
            start: val.start,
        }
    }


    function outDocumentHighlights(file: string, val: DocumentHighlights): DocumentHighlights {
        return {
            fileName: file,
            highlightSpans: val.highlightSpans.map(i => {
                if (i.fileName) {
                    console.trace(file, i.fileName);
                    debugger;
                }
                return {
                    fileName: i.fileName,
                    isInString: i.isInString,
                    kind: i.kind,
                    textSpan: outTextSpan(file, i.textSpan)
                }
            }),
        }
    }
    function outTextInsertion(file: string, val: TextInsertion): TextInsertion {
        return {
            caretOffset: val.caretOffset,
            newText: val.newText,
        }
    }
    function outDefinitionInfoAndBoundSpan(file: string, val: DefinitionInfoAndBoundSpan): DefinitionInfoAndBoundSpan {
        return {
            definitions: val.definitions && val.definitions.map(mappers.outDefinitionInfo, file),
            textSpan: outTextSpan(file, val.textSpan),
        }
    }
    function outCodeAction(file: string, val: CodeAction): CodeAction {
        return Object.assign(outCombinedCodeActions(file, val) as any, {
            description: val.description
        })
    }
    function outCompletionEntryDetails(file: string, val: CompletionEntryDetails): CompletionEntryDetails {
        return {
            codeActions: val.codeActions ? val.codeActions.map(mappers.outCodeAction, file) : undefined,
            displayParts: val.displayParts,
            documentation: val.documentation,
            kind: val.kind,
            kindModifiers: val.kindModifiers,
            name: val.name,
            source: val.source,
            tags: val.tags,
        }
    }
    function outCombinedCodeActions(file: string, val: CombinedCodeActions): CombinedCodeActions {
        return {
            changes: val.changes.map(mappers.outFileTextChanges, file),
            commands: val.commands
        }
    }
    function inCombinedCodeFixScope(file: string, val: CombinedCodeFixScope): CombinedCodeFixScope {
        if (isVueFile(file)) {
            return {
                fileName: toTsPath(val.fileName),
                type: val.type,
            }
        }

        return val;
    }


    function inNumberOrTextRange(file: string, val: number | TextRange): number | TextRange {
        if (typeof val === 'number') {
            return calculatePosition(file, val, false);
        }
        return inTextRange(file, val);
    }
    function inTextRange(file: string, val: TextRange): TextRange {
        return {
            end: calculatePosition(file, val.end, false),
            pos: calculatePosition(file, val.pos, false),
        }
    }




    function outLineAndCharacter(file: string, val: LineAndCharacter): LineAndCharacter {
        return getLineAndChar(file, val);

    }
    function outTodoComment(file: string, val: TodoComment): TodoComment {
        return {
            descriptor: val.descriptor,
            message: val.message,
            position: val.position
        }
    }
    function outSelectionRange(file: string, val: SelectionRange): SelectionRange {
        return {
            parent: val.parent ? outSelectionRange(file, val.parent) : undefined,
            textSpan: outTextSpan(file, val.textSpan)
        }
    }

    function outClassifiedSpan(file: string, val: ClassifiedSpan): ClassifiedSpan {
        return {
            classificationType: val.classificationType,
            textSpan: val.textSpan,
        }
    }

    function outRenameInfoFail(file: string, val: RenameInfoFailure): RenameInfoFailure {
        return {
            canRename: val.canRename,
            localizedErrorMessage: val.localizedErrorMessage,
        }
    }
    function outRenameInfo(file: string, val: RenameInfo): RenameInfo {
        if (isRenameInfoSuccess(val)) {
            return outRenameInfoSuccess(file, val);
        }
        return outRenameInfoFail(file, val);
    }
    function outQuickInfo(file: string, val: QuickInfo): QuickInfo {
        return {
            displayParts: val.displayParts,
            documentation: val.documentation,
            kind: val.kind,
            kindModifiers: val.kindModifiers,
            tags: val.tags,
            textSpan: outTextSpan(file, val.textSpan),

        }
    }
    function outNavigationBarItem(file: string, val: NavigationBarItem): NavigationBarItem {
        return {
            bolded: val.bolded,
            childItems: val.childItems,
            grayed: val.grayed,
            indent: val.indent,
            kind: val.kind,
            kindModifiers: val.kindModifiers,
            spans: val.spans,
            text: val.text,
        }
    }
    function outJsxClosingTagInfo(file: string, val: JsxClosingTagInfo): JsxClosingTagInfo {
        return {
            newText: val.newText,
        }
    }
    function outNavigateToItem(file: string, val: NavigateToItem): NavigateToItem {
        return {
            textSpan: outTextSpan(file, val.textSpan),
            containerKind: val.containerKind,
            containerName: val.containerName,
            fileName: val.fileName,
            isCaseSensitive: val.isCaseSensitive,
            kind: val.kind,
            kindModifiers: val.kindModifiers,
            matchKind: val.matchKind,
            name: val.name,
        };
    }
    function outClassifications(file: string, val: Classifications): Classifications {
        return {
            endOfLineState: val.endOfLineState,
            spans: val.spans,

        }
    }
    /***************************************************************************************************/
    /***************************************************************************************************/
    /***************************************************************************************************/
    /***************************************************************************************************/
    /***************************************************************************************************/
    /*                                          READY                                                  */
    /***************************************************************************************************/
    /***************************************************************************************************/
    /***************************************************************************************************/
    /***************************************************************************************************/
    /***************************************************************************************************/
    function outRefactorEditInfo(file: string, val: RefactorEditInfo): RefactorEditInfo {
        if (val.commands) {
            debugger;
            console.trace('outRefactorEditInfo->val.commands', val.commands);
        }

        return {
            commands: val.commands,
            edits: val.edits.map(mappers.outFileTextChanges, file),
            renameFilename: val.renameFilename && fromTsPath(val.renameFilename),
            renameLocation: val.renameLocation && calculatePosition(file, val.renameLocation),
        }
    }
    function outFileTextChanges(fileName: string, fileTextChanges: FileTextChanges): FileTextChanges {
        if (wasVueFile(fileTextChanges.fileName)) {
            fileName = fromTsPath(fileTextChanges.fileName);
            synchronize(fileName);
            return {
                fileName: fileName,
                isNewFile: fileTextChanges.isNewFile,
                textChanges: fileTextChanges.textChanges.map(mappers.outTextChange, fileName)
            }
        }
        return fileTextChanges;
    }
    function inTextChange(file: string, val: TextChange): TextChange {
        return {
            newText: val.newText,
            span: inTextSpan(file, val.span),
        }
    }
    function outTextChange(file: string, val: TextChange): TextChange {
        return {
            newText: val.newText,
            span: outTextSpan(file, val.span),
        }
    }
    function outSignatureHelpItems(file: string, val: SignatureHelpItems): SignatureHelpItems {
        if (wasVueFile(file)) {
            return {
                applicableSpan: outTextSpan(fromTsPath(file), val.applicableSpan),
                argumentCount: val.argumentCount,
                argumentIndex: val.argumentIndex,
                items: val.items,
                selectedItemIndex: val.selectedItemIndex,

            }
        }

        return val;
    }
    function outWithMetadataCompletionInfo(file: string, val: WithMetadata<CompletionInfo>): WithMetadata<CompletionInfo> {
        if (val.metadata) {
            debugger;
            console.trace('outWithMetadataCompletionInfo->val.metadata:', val.metadata);
        }
        if (wasVueFile(file)) {
            return {
                entries: val.entries.map(mappers.outCompletionEntry, file),
                isGlobalCompletion: val.isGlobalCompletion,
                isMemberCompletion: val.isMemberCompletion,
                isNewIdentifierLocation: val.isNewIdentifierLocation,
                metadata: val.metadata,
            }
        }

        return val;
    }
    function outCompletionEntry(file: string, val: CompletionEntry): CompletionEntry {
        if (val.replacementSpan) {
            return {
                hasAction: val.hasAction,
                insertText: val.insertText,
                isRecommended: val.isRecommended,
                kind: val.kind,
                kindModifiers: val.kindModifiers,
                name: val.name,
                replacementSpan: outTextSpan(file, val.replacementSpan),
                sortText: val.sortText,
                source: val.source,
            }
        }

        return val;
    }
    function outRenameInfoSuccess(file: string, val: RenameInfoSuccess): RenameInfoSuccess {
        if (wasVueFile(file)) {
            return {
                canRename: val.canRename,
                displayName: val.displayName,
                fileToRename: val.fileToRename,
                fullDisplayName: val.fullDisplayName,
                kind: val.kind,
                kindModifiers: val.kindModifiers,
                triggerSpan: outTextSpan(file, val.triggerSpan),
            }
        }

        return val;
    }
    function outRenameLocation(fileName: string, rename: RenameLocation): RenameLocation {
        if (wasVueFile(rename.fileName)) {
            const fileName = fromTsPath(rename.fileName);
            return {
                fileName: fileName,
                originalFileName: rename.originalFileName,
                originalTextSpan: rename.originalTextSpan,
                prefixText: rename.prefixText,
                suffixText: rename.suffixText,
                textSpan: outTextSpan(fileName, rename.textSpan),
            }
        }

        return rename;
    }
    function outReferencedSymbolDefinitionInfo(fileName: string, ref: ReferencedSymbolDefinitionInfo): ReferencedSymbolDefinitionInfo {
        if (wasVueFile(ref.fileName)) {
            fileName = fromTsPath(ref.fileName);
            return {
                fileName: fileName,
                kind: ref.kind,
                name: ref.name,
                originalFileName: ref.originalFileName,
                originalTextSpan: ref.originalTextSpan,
                textSpan: outTextSpan(fileName, ref.textSpan),
                containerKind: ref.containerKind,
                containerName: ref.containerName,
                displayParts: ref.displayParts,
            }
        }
        return ref;
    }

    function outReferencedSymbol(fileName: string, symbol: ReferencedSymbol): ReferencedSymbol {
        return {
            definition: outReferencedSymbolDefinitionInfo(fileName, symbol.definition),
            references: symbol.references.map(r => outReferenceEntry(fileName, r))
        }
    }

    function outReferenceEntry(fileName: string, ref: ReferenceEntry): ReferenceEntry {
        if (wasVueFile(ref.fileName)) {
            fileName = fromTsPath(ref.fileName);
            return {
                fileName: fileName,
                isDefinition: ref.isDefinition,
                isInString: ref.isInString,
                isWriteAccess: ref.isWriteAccess,
                originalFileName: ref.originalFileName,
                originalTextSpan: ref.originalTextSpan,
                textSpan: outTextSpan(fileName, ref.textSpan),
            }
        }
        return ref;
    }
    function outDefinitionInfo(fileName: string, def: DefinitionInfo): DefinitionInfo {
        if (wasVueFile(def.fileName)) {
            fileName = fromTsPath(def.fileName)
            return {
                fileName: fileName,
                kind: def.kind,
                name: def.name,
                originalFileName: def.originalFileName,
                originalTextSpan: def.originalTextSpan,
                textSpan: outTextSpan(fileName, def.textSpan),
                containerKind: def.containerKind,
                containerName: def.containerName,
            }
        }
        return def;
    }
    function outCodeFixAction(file: string, val: CodeFixAction): CodeFixAction {
        if (val.commands) {
            console.trace('outCodeFixAction', file, val.commands);
            debugger;
        }
        return {
            changes: val.changes.map(mappers.outFileTextChanges, file),
            commands: val.commands,
            description: val.description,
            fixAllDescription: val.fixAllDescription,
            fixId: val.fixId,
            fixName: val.fixName,

        }
    }

    function outApplicableRefactorInfo(file: string, val: ApplicableRefactorInfo): ApplicableRefactorInfo {
        return val;
    }
    function outDiagnosticWithLocation(file: string, diag: DiagnosticWithLocation): DiagnosticWithLocation {
        return {
            category: diag.category,
            code: diag.code,
            file: diag.file,
            length: diag.length,
            messageText: diag.messageText,
            relatedInformation: diag.relatedInformation,
            reportsUnnecessary: diag.reportsUnnecessary,
            source: diag.source,
            start: calculatePosition(file, diag.start),
        }
    }

    function outNavigationTree(file: string, val: NavigationTree): NavigationTree {
        return {
            childItems: val.childItems && val.childItems.length ? val.childItems.map(c => outNavigationTree(file, c)) : [],
            kind: val.kind,
            kindModifiers: val.kindModifiers,
            nameSpan: val.nameSpan ? outTextSpan(file, val.nameSpan) : undefined,
            spans: val.spans.map(mappers.outTextSpan, file),
            text: val.text,
        }
    }
    function outDiagnostic(file: string, val: Diagnostic): Diagnostic {
        return {
            category: val.category,
            code: val.code,
            file: val.file,
            messageText: val.messageText,
            relatedInformation: val.relatedInformation,
            reportsUnnecessary: val.reportsUnnecessary,
            source: val.source,
            length: val.length,
            start: typeof val.start === 'number' ? calculatePosition(file, val.start) : undefined,
        }
    }
    function outTextSpan(file: string, val: TextSpan): TextSpan {
        return {
            length: val.length,
            start: calculatePosition(file, val.start),
        }
    }
    function outOutliningSpan(file: string, val: OutliningSpan): OutliningSpan {
        return {
            autoCollapse: val.autoCollapse,
            bannerText: val.bannerText,
            hintSpan: outTextSpan(file, val.hintSpan),
            kind: val.kind,
            textSpan: outTextSpan(file, val.textSpan),
        }
    }
}
function isRenameInfoSuccess(val: any): val is RenameInfoSuccess {
    return 'displayName' in val
        && 'fullDisplayName' in val;
}



