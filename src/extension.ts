// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from "fs";  
import * as cp from 'child_process';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const execShell = (cmd: string) =>
    new Promise<string>((resolve, reject) => {
        cp.exec(cmd, (err, out) => {
            if (err) {
                return reject(err);
            }
            return resolve(out);
        });
    });
	
	let disposable = vscode.commands.registerCommand('rebuilder.rebuildDirectory', (uri:vscode.Uri) => {
		
		var root = vscode.Uri.parse(uri.fsPath.substring(0,uri.fsPath.indexOf('lib')));
		
		var inPackagePath = uri.fsPath.substring(uri.fsPath.indexOf('lib'), uri.fsPath.length);
		// var filter = '--build-filter="package:capp_shared/src/application/change_password/change_password_bloc.dart"';
		var filter = `--build-filter=".\\${inPackagePath}"`;
		console.log('XXX',root);
		console.log('XXX',uri.fsPath);
		console.log('filter: ', filter);
		// cp.execSync('flutter pub get');
		var x = cp.spawn('flutter', ['pub', 'run', 'build_runner', 'build','--delete-conflicting-outputs', filter],{
			cwd: root.fsPath,
			shell: true
		});
		x.stdout.on('data',(data) => {
			console.log('data\n ' + data);
			vscode.window.showInformationMessage
			vscode.window.showInformationMessage('Rebuild directory from Rebuilder!');
		});
		x.stderr.on('data',(err) => {
			console.log('err\n ' + err);
		});
		x.stderr.on('close',() => {
			console.log('err\n ');
		});
		x.stderr.on('end',() => {
			console.log('err\n end');
			vscode.window.showErrorMessage('Rebuilder: failure end');
		});
		
		x.on("message", (e)=> {
			console.log(e);
		});
		x.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			if (code == 0){
				vscode.window.showInformationMessage(`${uri.toString()} Regenerated`);
			}
			});
		console.log(x.stdout);
		console.log(x.stderr);
		// cp.spawn('flutter', ['pub', 'run', 'build_runner', 'build','--delete-conflicting-outputs','--verbose','--build-filter="$uri/**.dart"'], {
		// 	cwd: uri.fsPath,
		// }, (err, stdout, stderr) => {
		// 	console.log('stdout: ' + stdout);
		// 	console.log('stderr: ' + stderr);
		// 	if (err) {
		// 		console.log('error: ' + err);
		// 	}
		// });
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
