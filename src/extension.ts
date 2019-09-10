// The module 'vscode' contains the VS Code extensibility API
// FIXME: restrict import to what is actually needed
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';
import * as path from 'path';
import { Server } from 'http';

let client: lspclient.LanguageClient;


// tslint:disable-next-line: typedef
export function activate(context: vscode.ExtensionContext) {

	console.log('Your extension "vscode-prometheus" is now active!');

	// The command has been defined in the package.json file
	// The commandId parameter must match the command field in package.json
	let disposable: lspclient.Disposable =
		vscode.commands.registerCommand('extension.usePromQLLangServer', () => {
			vscode.window.showInformationMessage('Not implemented yet :(');
		});

	context.subscriptions.push(disposable);


	let serverExec: lspclient.Executable = {
		command: context.asAbsolutePath(path.join('path', 'to', 'langserver')),
		args: []
	};
	// Only used when extension is launched in debug mode

	let serverExecDebug: lspclient.Executable = {
		command: context.asAbsolutePath(path.join('path', 'to', 'langserver')),
		args: ['--verbose']
	};

	let serverOptions: lspclient.ServerOptions = {
		run: serverExec,
		debug: serverExecDebug
	};

	let clientOptions: lspclient.LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'promql' }],
		synchronize: {
			// This can be used as a config file later 
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.promql-lsp.json')
		}
	};

	client = new lspclient.LanguageClient(
    'promql-lsp-client',
    'PromQL Language Server',
    serverOptions,
    clientOptions
  );

  client.start();

}


// tslint:disable-next-line: typedef
export function deactivate() { }
