// The module 'vscode' contains the VS Code extensibility API
// FIXME: restrict import to what is actually needed
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';
import * as path from 'path';
import { Server } from 'http';

let client: lspclient.LanguageClient;

// FIXME
// tslint:disable-next-line: typedef
export function activate(context: vscode.ExtensionContext) {

	console.log('Your extension "vscode-prometheus" is now active!');

	let serverExec: lspclient.Executable = {
		command: context.asAbsolutePath(path.join("..", "promql-lsp", "promql-lsp")),
		args: []
	};
	console.log("Server Path:" + serverExec.command);
	// Only used when extension is launched in debug mode

	let serverExecDebug: lspclient.Executable = {
		command: context.asAbsolutePath(path.join("..", "promql-lsp", "promql-lsp")),
		args: ['--verbose'],
		
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


// FIXME
// tslint:disable-next-line: typedef
export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
