import * as vscode from 'vscode';

export class ManageLexerViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'acaciaLexer.manageLexerView';

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

        webviewView.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'startTokenize':
                    vscode.window.showInformationMessage('Tokenization started!');
                    break;
            }
        });
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const buttonStyle = 'padding: 10px 20px; font-size: 16px; cursor: pointer;';
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Manage Lexer</title>
            </head>
            <body>
                <button id="startTokenizeButton" style="${buttonStyle}">Start Tokenize</button>
                <script>
                    const vscode = acquireVsCodeApi();
                    document.getElementById('startTokenizeButton').addEventListener('click', () => {
                        vscode.postMessage({ command: 'startTokenize' });
                    });
                </script>
            </body>
            </html>
        `;
    }
}

// Register the WebviewViewProvider in your extension's activate function
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            ManageLexerViewProvider.viewType,
            new ManageLexerViewProvider(context.extensionUri)
        )
    );
}