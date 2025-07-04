"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const php_provider_1 = require("./providers/php-provider");
class FQCNExtension {
    constructor(context) {
        this.providers = [];
        this.context = context;
        this.initializeProviders();
        this.registerCommands();
    }
    initializeProviders() {
        // Register PHP provider
        this.providers.push(new php_provider_1.PHPProvider());
        // Future providers can be added here
        // this.providers.push(new JavaScriptProvider());
        // this.providers.push(new PythonProvider());
    }
    registerCommands() {
        const copyFQCNCommand = vscode.commands.registerCommand('fqcnCopier.copyFQCN', async () => {
            await this.copyFQCN();
        });
        this.context.subscriptions.push(copyFQCNCommand);
    }
    async copyFQCN() {
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
            const showNotifications = config.get('showNotifications', true);
            if (showNotifications) {
                vscode.window.showInformationMessage(`Copied ${result.elementType}: ${result.fqcn}`);
            }
        }
        catch (error) {
            console.error('Error extracting FQCN:', error);
            vscode.window.showErrorMessage('Failed to extract FQCN');
        }
    }
    dispose() {
        // Cleanup if needed
    }
}
function activate(context) {
    console.log('FQCN Copier extension is now active');
    const extension = new FQCNExtension(context);
    // Store extension instance for potential cleanup
    context.subscriptions.push({
        dispose: () => extension.dispose()
    });
}
exports.activate = activate;
function deactivate() {
    console.log('FQCN Copier extension is now deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map