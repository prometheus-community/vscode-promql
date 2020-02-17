// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';
import * as path from 'path';
import * as ws from 'ws';
import * as os from 'os';
import * as zlib from 'zlib';
import * as tar from 'tar-fs';
import * as fs from 'fs';
import * as redirects from 'follow-redirects';

let client: lspclient.LanguageClient;

let socket = new ws(`ws://localhost:7000`);

// FIXME
// tslint:disable-next-line: typedef
export async function activate(context: vscode.ExtensionContext) {

	let defaultConfig = path.join(context.extensionPath, 'promql-lsp.yaml');
	console.log('Your extension "vscode-prometheus" is now active!');
	let serverPath = vscode.workspace.getConfiguration('promql').get('langserverBinaryPath', "");
	let serverConfig = vscode.workspace.getConfiguration('promql').get('langServerConfigPath', defaultConfig);

	if (serverPath === "") {
		let downloadedLangserver = langserverDownloadPath(context);
		if (fs.existsSync(downloadedLangserver)) {
			serverPath = downloadedLangserver;
		} else {
			downloadLangserver(context, activate);
			return;
		}
	}

	console.log('Server Command: ', serverPath);
	console.log('Server Config: ', serverConfig);


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
			console.log(value);
			value.split("\r\n").forEach(line => {
				if (socket && socket.readyState === ws.OPEN) {
					socket.send(line);
				}
			});
		},
		appendLine(value: string) {
			console.log(value);
			// Don't send logs until WebSocket initialization
			if (socket && socket.readyState === ws.OPEN) {
				socket.send(value);
			}
		},
		clear() { },
		show() { },
		hide() { },
		dispose() { }
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
		synchronize: {
			configurationSection: 'prometheus'
		},
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

// tslint:disable-next-line: max-line-length
function downloadLangserver(context: vscode.ExtensionContext, callback: any) {

	// change this after every new langserver release
	let langserverVersion = "0.4.2";

	let url = getReleaseURL(langserverVersion);

	console.log("Downloading langserver from: " + url);

	let tarballPath = path.join(context.extensionPath, "promql-langserver.tar");
	let installPath = path.join(context.extensionPath, "promql-langserver");


	redirects.https.get(url, function (response) {
		let stream = response
			.pipe(zlib.createGunzip())
			.pipe(tar.extract(installPath));

		stream.on('finish', function () {
			if (fs.existsSync(langserverDownloadPath(context))) {
				console.log("Sucessfully downloaded langserver");
				callback(context);
			} else {
				console.log("Failed to download langserver for unknown reason");
			}
		});

		stream.on('error', function (err) {
				console.log("Failed to download langserver:");
			console.log(err);
		})
	});
}


function getReleaseURL(langserverVersion: string): string {
	var platform: string = os.platform();

	if (platform === "win32") {
		platform = "windows";
	}

	var arch: string = os.arch();

	if (arch === "x32") {
		arch = "386";
	}

	if (arch === "x64") {
		arch = "amd64";
	}


	return "https://github.com/prometheus-community/promql-langserver/releases/download/v"
		+ langserverVersion
		+ "/promql-langserver_"
		+ langserverVersion
		+ "_"
		+ platform
		+ "_"
		+ arch
		+ ".tar.gz";
}

function langserverDownloadPath(context: vscode.ExtensionContext): string {
	let ret = path.join(context.extensionPath, 'promql-langserver', 'promql-langserver');

	if (os.platform() === "win32") {
		ret += ".exe";
	}

	return ret;
}

export function deactivate() {
	socket.close();
	if (!client) {
		return undefined;
	}
	return client.stop();
}

