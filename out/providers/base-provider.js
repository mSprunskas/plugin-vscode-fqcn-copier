"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProvider = void 0;
class BaseProvider {
    /**
     * Check if the provider can handle the given document
     */
    canHandle(document) {
        return document.languageId === this.languageId;
    }
    /**
     * Get the word range at the given position
     */
    getWordRangeAtPosition(document, position) {
        return document.getWordRangeAtPosition(position, /[\w$]+/);
    }
    /**
     * Get text from a specific line
     */
    getLineText(document, lineNumber) {
        if (lineNumber < 0 || lineNumber >= document.lineCount) {
            return '';
        }
        return document.lineAt(lineNumber).text;
    }
    /**
     * Find the containing class for a given position
     */
    findContainingClass(document, position) {
        const text = document.getText();
        const offset = document.offsetAt(position);
        // Find the last class declaration before the current position
        const classMatches = Array.from(text.matchAll(/(?:class|interface|trait)\s+(\w+)/g));
        let containingClass = null;
        for (const match of classMatches) {
            if (match.index !== undefined && match.index < offset) {
                containingClass = match[1];
            }
            else {
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
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=base-provider.js.map