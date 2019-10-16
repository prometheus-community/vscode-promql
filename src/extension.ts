// The module 'vscode' contains the VS Code extensibility API
// FIXME: restrict import to what is actually needed
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';
import * as path from 'path';
import * as webSocket from 'ws';
import { Server } from 'http';
import * as cp from 'child_process';

let client: lspclient.LanguageClient;

// FIXME
// tslint:disable-next-line: typedef
export async function activate(context: vscode.ExtensionContext) {

	console.log('Your extension "vscode-prometheus" is now active!');

	let log = '';
	const stderrOutputChannel: vscode.OutputChannel = {
		name: 'stderr',
		// Only append the logs but send them later
		append(value: string) {
			console.log(value);
		},
		appendLine(value: string) {
			console.log(value);
		},
		clear() { },
		show() { },
		hide() { },
		dispose() { }
	};
	console.log("Hi");

	let serverExec: lspclient.Executable = {
		command: context.asAbsolutePath(path.join("..", "promql-lsp", "promql-langserver")),
		args: []
	};
	console.log("Server Path:" + serverExec.command);

	let serverExecDebug: lspclient.Executable = {
		command: context.asAbsolutePath(path.join("..", "promql-lsp", "promql-langserver")),
		options: {}
	};

	let serverOptions: lspclient.ServerOptions = {
		run: serverExec,
		debug: serverExecDebug
	};

	let clientOptions: lspclient.LanguageClientOptions = {
		initializationOptions: {},
		documentSelector: [{ scheme: 'file', language: 'promql' },
		{ scheme: 'file', language: 'go' }],
		outputChannel: stderrOutputChannel,
	};

	client = new lspclient.LanguageClient(
		'promql-lsp-client',
		'PromQL Language Server',
		serverOptions,
		clientOptions
	);
	let c = client.start();
	context.subscriptions.push(c);
}


export function deactivate() {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

