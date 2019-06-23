import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const tsExt = vscode.extensions.getExtension('vscode.typescript-language-features')
	if (!tsExt) {
		throw new Error('Typescript extension not found?');
	}
	if (!tsExt.isActive) {
		return tsExt.activate();
	}


}

