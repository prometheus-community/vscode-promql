// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import * as lspclient from 'vscode-languageclient';
import * as path from 'path';
import * as ws from 'ws';
import * as os from 'os';
import * as https from 'https';
import * as zlib from 'zlib';
import * as tar from 'tar-stream';
import * as fs from 'fs';
import * as redirects from 'follow-redirects';

let client: lspclient.LanguageClient;

let socket = new ws(`ws://localhost:7000`);

// FIXME
// tslint:disable-next-line: typedef
export async function activate(context: vscode.ExtensionContext) {

	let defaultConfig = path.join(context.extensionPath, 'promql-lsp.yaml');
	console.log('Your extension "vscode-prometheus" is now active!');
	let serverPath = vscode.workspace.getConfiguration('prometheus').get('langserverBinaryPath', 'promql-langserver');
	let serverConfig = vscode.workspace.getConfiguration('prometheus').get('langServerConfigPath', defaultConfig);

	console.log('Server Command: ', serverPath);
	console.log('Server Config: ', serverConfig);

	// TODO ask user
	downloadLangserver(context);


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
		synchronize : {
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

export function downloadLangserver(context : vscode.ExtensionContext){
	// change this after every new langserver release
	let langserverVersion = "v0.4.0";

	let url = getReleaseURL(langserverVersion);

	console.log(url);
	let installPath = path.join(context.extensionPath, 'promql-langserver');

	if (os.platform() === "win32"){
		installPath += ".exe";
	}

	// TODO make executable
	let fileStream = fs.createWriteStream(installPath);

	

	var data = '';

	//fileStream.

	let extract = tar.extract();

	// tslint:disable-next-line: max-line-length
	// from https://stackoverflow.com/questions/19978452/how-to-extract-single-file-from-tar-gz-archive-using-node-js

	extract.on('entry', function(header, stream, cb){
		console.log('extracting');
			let fileName = path.basename(header.name);
			console.log(fileName);
		stream.on('data', function(chunk){
			if (fileName === 'promql-langserver' 
			|| fileName === 'promql-langserver.exe'){
				console.log("lol");
				console.log(chunk);
				fileStream.write(chunk);
			}
		});
		stream.on('end', function(){
			cb();
		});
		stream.on('finish', function () {
			fileStream.close();
		});
		stream.on('error', function(err) { // Handle errors
			console.log(err);
			cb();
		});
	});

	redirects.https.get(url, function(response){
		response
		.pipe(zlib.createGunzip())
		.pipe(extract);
	});

	console.log('data');
	console.log(data);
}


export function getReleaseURL(langserverVersion: string): string {
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


	return "https://github.com/slrtbtfs/promql-lsp/releases/download/"
		+ langserverVersion
		+ "/promql-langserver-"
		+ langserverVersion
		+ "."
		+ platform
		+ "-"
		+ arch
		+ ".tar.gz";
}

export function deactivate() {
	socket.close();
	if (!client) {
		return undefined;
	}
	return client.stop();
}

