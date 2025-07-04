"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHPProvider = void 0;
const base_provider_1 = require("./base-provider");
class PHPProvider extends base_provider_1.BaseProvider {
    constructor() {
        super(...arguments);
        this.languageId = 'php';
    }
    async extractFQCN(document, position) {
        const wordRange = this.getWordRangeAtPosition(document, position);
        if (!wordRange) {
            return null;
        }
        const word = document.getText(wordRange);
        const line = this.getLineText(document, position.line);
        // Determine element type and extract FQCN
        const elementType = this.determineElementType(line, word, position.character);
        if (!elementType) {
            return null;
        }
        const classInfo = this.findContainingClass(document, position);
        if (!classInfo) {
            return null;
        }
        const fqcn = this.buildFQCN(classInfo, word, elementType);
        return {
            fqcn,
            elementType
        };
    }
    determineElementType(line, word, character) {
        // Check if it's a property (starts with $)
        if (word.startsWith('$')) {
            return 'property';
        }
        // Check if it's a method (followed by parentheses)
        const afterWord = line.substring(character + word.length).trim();
        if (afterWord.startsWith('(')) {
            return 'method';
        }
        // Check if it's a constant (all uppercase or defined with const)
        if (line.includes('const ') && line.includes(word)) {
            return 'constant';
        }
        // Check if it's a class constant (all uppercase, not a method or property)
        if (word === word.toUpperCase() && word.length > 1 && /^[A-Z_][A-Z0-9_]*$/.test(word)) {
            return 'constant';
        }
        // Check if it's a class declaration
        if (line.match(new RegExp(`(?:class|interface|trait)\\s+${word}\\b`))) {
            return 'class';
        }
        // Check if it's a method (function keyword)
        if (line.includes('function ') && line.includes(word)) {
            return 'method';
        }
        // Default to method if we can't determine (most common case)
        return 'method';
    }
    buildFQCN(classInfo, element, elementType) {
        const fullClassName = classInfo.namespace ? `${classInfo.namespace}\\${classInfo.className}` : classInfo.className;
        switch (elementType) {
            case 'class':
                return fullClassName;
            case 'method':
                return `${fullClassName}::${element}`;
            case 'property':
                // Ensure property has $ prefix
                const propertyName = element.startsWith('$') ? element : `$${element}`;
                return `${fullClassName}::${propertyName}`;
            case 'constant':
                return `${fullClassName}::${element}`;
            default:
                return fullClassName;
        }
    }
    findContainingClass(document, position) {
        const text = document.getText();
        const offset = document.offsetAt(position);
        // Find all class/interface/trait declarations with their positions
        const classRegex = /(?:class|interface|trait)\s+(\w+)/g;
        const classMatches = [];
        let match;
        while ((match = classRegex.exec(text)) !== null) {
            const className = match[1];
            const start = match.index;
            // Find the end of the class (closing brace)
            let braceCount = 0;
            let i = start;
            let foundOpenBrace = false;
            while (i < text.length) {
                if (text[i] === '{') {
                    foundOpenBrace = true;
                    braceCount++;
                }
                else if (text[i] === '}') {
                    braceCount--;
                    if (foundOpenBrace && braceCount === 0) {
                        break;
                    }
                }
                i++;
            }
            classMatches.push({
                name: className,
                start: start,
                end: i
            });
        }
        // Find which class contains the current position
        const containingClass = classMatches.find(cls => offset >= cls.start && offset <= cls.end);
        if (!containingClass) {
            return null;
        }
        // Find namespace
        const namespaceMatch = text.match(/namespace\s+([\w\\]+);/);
        const namespace = namespaceMatch ? namespaceMatch[1] : '';
        return {
            className: containingClass.name,
            namespace: namespace
        };
    }
}
exports.PHPProvider = PHPProvider;
//# sourceMappingURL=php-provider.js.map