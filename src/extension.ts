// The module 'vscode' contains the VS Code extensibility API
// FIXME: restrict import to what is actually needed
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';

let client: lspclient.LanguageClient;


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vscode-prometheus" is now active!');

	// The command has been defined in the package.json file
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.usePromQLLangServer', () => {
		vscode.window.showInformationMessage('Not implemented yet :(');
	});

	context.subscriptions.push(disposable);
}


export function deactivate() {}
