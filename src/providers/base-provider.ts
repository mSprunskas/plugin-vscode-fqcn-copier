import * as vscode from 'vscode';

export interface FQCNResult {
    fqcn: string;
    elementType: 'class' | 'method' | 'property' | 'constant' | 'function';
}

export abstract class BaseProvider {
    abstract readonly languageId: string;
    
    /**
     * Extract FQCN from the current cursor position
     */
    abstract extractFQCN(document: vscode.TextDocument, position: vscode.Position): Promise<FQCNResult | null>;
    
    /**
     * Check if the provider can handle the given document
     */
    canHandle(document: vscode.TextDocument): boolean {
        return document.languageId === this.languageId;
    }
    
    /**
     * Get the word range at the given position
     */
    protected getWordRangeAtPosition(document: vscode.TextDocument, position: vscode.Position): vscode.Range | undefined {
        return document.getWordRangeAtPosition(position, /[\w$]+/);
    }
    
    /**
     * Get text from a specific line
     */
    protected getLineText(document: vscode.TextDocument, lineNumber: number): string {
        if (lineNumber < 0 || lineNumber >= document.lineCount) {
            return '';
        }
        return document.lineAt(lineNumber).text;
    }
    
    /**
     * Find the containing class for a given position
     */
    protected findContainingClass(document: vscode.TextDocument, position: vscode.Position): { className: string; namespace: string } | null {
        const text = document.getText();
        const offset = document.offsetAt(position);
        
        // Find the last class declaration before the current position
        const classMatches = Array.from(text.matchAll(/(?:class|interface|trait)\s+(\w+)/g));
        let containingClass = null;
        
        for (const match of classMatches) {
            if (match.index !== undefined && match.index < offset) {
                containingClass = match[1];
            } else {
                break;
            }
        }
        
        if (!containingClass) {
            return null;
        }
        
        // Find namespace
        const namespaceMatch = text.match(/namespace\s+([\w\\]+);/);
        const namespace = namespaceMatch ? namespaceMatch[1] : '';
        
        return {
            className: containingClass,
            namespace: namespace
        };
    }
}
