const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


// Function to perform asynchronous operations
async function doAsyncWork() {
  // Retrieve saved preferences
  const mavenRepoPath = await vscode.window.showInputBox({ prompt: 'Enter Maven repository path' }) || '';

  // Validate path
  if (!mavenRepoPath) {
    vscode.window.showErrorMessage('Invalid path');
    return;
  }

  // Clean Maven temp files
  await cleanMavenTempFiles(mavenRepoPath);
  vscode.window.showInformationMessage('Maven Cleaner finished');
}

// Activate function
function activate(context) {
  console.log('Maven Cleaner active!');

  const disposable = vscode.commands.registerCommand('mvn-cleaner-vscode.MavenCleaner', async () => {
    // Call the async function
    doAsyncWork();
  });
  context.subscriptions.push(disposable);
  // Register the shortcut command
  context.subscriptions.push(
    vscode.commands.registerCommand('mvn-cleaner-vscode.MavenCleanerShortcut', () => {
      doAsyncWork();
    })
  );
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

// Deactivate function (not modified)
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
