import * as vscode from 'vscode';
import { BaseProvider } from './providers/base-provider';
import { PHPProvider } from './providers/php-provider';

class FQCNExtension {
    private providers: BaseProvider[] = [];
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.initializeProviders();
        this.registerCommands();
    }

    private initializeProviders(): void {
        // Register PHP provider
        this.providers.push(new PHPProvider());
        
        // Future providers can be added here
        // this.providers.push(new JavaScriptProvider());
        // this.providers.push(new PythonProvider());
    }

    private registerCommands(): void {
        const copyFQCNCommand = vscode.commands.registerCommand('fqcnCopier.copyFQCN', async () => {
            await this.copyFQCN();
        });

        this.context.subscriptions.push(copyFQCNCommand);
    }

    private async copyFQCN(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const position = editor.selection.active;

        // Find appropriate provider for the current document
        const provider = this.providers.find(p => p.canHandle(document));
        if (!provider) {
            vscode.window.showErrorMessage(`FQCN extraction not supported for ${document.languageId} files`);
            return;
        }

        try {
            const result = await provider.extractFQCN(document, position);
            if (!result) {
                vscode.window.showWarningMessage('Could not determine FQCN at cursor position');
                return;
            }

            // Copy to clipboard
            await vscode.env.clipboard.writeText(result.fqcn);

            // Show notification if enabled
            const config = vscode.workspace.getConfiguration('fqcnCopier');
            const showNotifications = config.get<boolean>('showNotifications', true);
            
            if (showNotifications) {
                vscode.window.showInformationMessage(`Copied ${result.elementType}: ${result.fqcn}`);
            }

        } catch (error) {
            console.error('Error extracting FQCN:', error);
            vscode.window.showErrorMessage('Failed to extract FQCN');
        }
    }

    public dispose(): void {
        // Cleanup if needed
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('FQCN Copier extension is now active');
    
    const extension = new FQCNExtension(context);
    
    // Store extension instance for potential cleanup
    context.subscriptions.push({
        dispose: () => extension.dispose()
    });
}

export function deactivate() {
    console.log('FQCN Copier extension is now deactivated');
}
