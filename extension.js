// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Maven Cleaner" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	vscode.window.showInformationMessage('Maven Cleaner Start!');

	let disposable = vscode.commands.registerCommand('mvn-cleaner-vscode.MavenCleaner', async () => {
        let alwaysSelected = false;
        let mavenRepoPath = '';

        if (!alwaysSelected) {
            alwaysSelected = await vscode.window.showQuickPick(
                ['Yes', 'No'],
                { placeHolder: 'Always select?' }
            ) === 'Yes';

            mavenRepoPath = await vscode.window.showInputBox({ prompt: 'Enter Maven repository path' }) || '';
        }

        if (!mavenRepoPath) {
            vscode.window.showErrorMessage('Invalid path');
            return;
        }

        await cleanMavenTempFiles(mavenRepoPath);
		vscode.window.showInformationMessage('Maven Cleaner finished');
    });

    context.subscriptions.push(disposable);
}

async function cleanMavenTempFiles(rootPath) {
    const files = await fs.promises.readdir(rootPath);
    for (const file of files) {
        const filePath = path.join(rootPath, file);
        const stats = await fs.promises.stat(filePath);

        if (stats.isDirectory()) {
            await cleanMavenTempFiles(filePath); // Recursively clean subdirectories
        } else {
            if (file.endsWith('.lastUpdated')) {
                await fs.promises.unlink(filePath);
                console.log(`Deleted: ${filePath}`);
            }
        }
    }
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
