import * as vscode from 'vscode';
import { ObjectRegistry } from '../utils/ObjectRegistry';

export class ManageLexerViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'acaciaLexer.manageLexerView';

    public or: ObjectRegistry = ObjectRegistry.getInstance();

    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): void {

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        let selectedFolder = this.or.getSelectedFolder();

                    
        // Send the selected folder path to the webview if it exists
        
        if (selectedFolder) {    
            webviewView.webview.postMessage({
                command: 'updateSelectedFolder',
                folderPath: selectedFolder,
            });
        }  


        webviewView.onDidChangeVisibility((e) => {
            if (webviewView.visible) {
                if (selectedFolder) {

                    webviewView.webview.postMessage({
                        command: 'updateSelectedFolder',
                        folderPath: selectedFolder,
                    });
                }
                }
        });
        

        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'startTokenize':
                    if (selectedFolder) {
                        vscode.window.showInformationMessage(`Tokenization started for folder: ${selectedFolder}`);
                        // Add your tokenization logic here
                    } else {
                        vscode.window.showWarningMessage('No folder selected for tokenization.');
                    }
                    break;
                case 'selectFolder':
                    const folderUri = await vscode.window.showOpenDialog({
                        canSelectFolders: true,
                        canSelectFiles: false,
                        canSelectMany: false,
                        openLabel: 'Select Folder for Tokenization',
                    });
                    if (folderUri && folderUri.length > 0) {
                        selectedFolder = folderUri[0].fsPath;
                        vscode.window.showInformationMessage(`Selected folder: ${selectedFolder}`);
                        this.or.setSelectedFolder(selectedFolder); // Store the selected folder in the registry

                        // Send the selected folder path to the webview
                        webviewView.webview.postMessage({
                            command: 'updateSelectedFolder',
                            folderPath: selectedFolder,
                        });

                    }
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const buttonStyle = 'padding: 10px 20px; font-size: 16px; cursor: pointer; margin: 5px;';
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Manage Lexer</title>
            </head>
            <body>
                <button id="selectFolderButton" style="${buttonStyle}">Select Folder</button>
                <button id="startTokenizeButton" style="${buttonStyle}">Start Tokenize</button>
                <textarea id="selectedFolderTextarea" style="width: 100%; height: 100px; margin-top: 10px;" readonly></textarea>
                <script>
                    const vscode = acquireVsCodeApi();

                    // Handle button clicks
                    document.getElementById('selectFolderButton').addEventListener('click', () => {
                        vscode.postMessage({ command: 'selectFolder' });
                    });
                    document.getElementById('startTokenizeButton').addEventListener('click', () => {
                        vscode.postMessage({ command: 'startTokenize' });
                    });

                    // Handle messages from the extension
                    window.addEventListener('message', (event) => {
                        const message = event.data;
                        if (message.command === 'updateSelectedFolder') {
                            const textarea = document.getElementById('selectedFolderTextarea');
                            textarea.value = message.folderPath;
                        }
                    });
                </script>
            </body>
            </html>
        `;
    }
}

