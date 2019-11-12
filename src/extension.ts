// The module 'vscode' contains the VS Code extensibility API
// FIXME: restrict import to what is actually needed
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';
import * as path from 'path';
import * as ws from 'ws';
import { Server } from 'http';
import * as cp from 'child_process';

let client: lspclient.LanguageClient;

let socket = new ws(`ws://localhost:7000`);

// FIXME
// tslint:disable-next-line: typedef
export async function activate(context: vscode.ExtensionContext) {

	let defaultConfig = path.join(context.extensionPath, 'promql-lsp.yaml');
	console.log('Your extension "vscode-prometheus" is now active!');
	let serverPath = vscode.workspace.getConfiguration('vscode-promql').get('langServerBinaryPath', 'promql-langserver');
	let serverConfig = vscode.workspace.getConfiguration('vscode-promql').get('langServerConfigPath', defaultConfig);

	console.log('Server Command: ', serverPath);
	console.log('Server Config: ', serverConfig);



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

	const websocketOutputChannel: vscode.OutputChannel = {
		name: 'websocket',
			// Only append the logs but send them later
			append(value: string) {
				value.split("\r\n").forEach(line => {
					if (socket && socket.readyState === ws.OPEN) {
						let err = socket.send(line);
						console.log(line);
						log = '';
				}
				});
			},
			appendLine(value: string) {
				log += value;
				// Don't send logs until WebSocket initialization
				if (socket && socket.readyState === ws.OPEN) {
					let err = socket.send(log);
					console.log(log);
					log = '';
				}
			},
		clear() {},
		show() {},
		hide() {},
		dispose() {}
	};


	let serverExec: lspclient.Executable = {
		command: serverPath,
		args: ['--config-file', serverConfig]
	};

	let serverOptions: lspclient.ServerOptions = {
		run: serverExec,
		debug: serverExec
	};

	let clientOptions: lspclient.LanguageClientOptions = {
		initializationOptions: {},
		documentSelector: [{ scheme: 'file', language: 'promql' },
		{ scheme: 'file', language: 'yaml' }],
		outputChannel: websocketOutputChannel
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
	socket.close();
	if (!client) {
		return undefined;
	}
	return client.stop();
}

