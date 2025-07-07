# FQCN Copier - VSCode Extension

A Visual Studio Code extension that allows you to copy Fully Qualified Class Names (FQCN) for PHP classes, methods, properties, and constants with a simple right-click.

## Features

- **Right-click context menu**: Copy FQCN directly from the editor context menu
- **PHP Support**: Full support for PHP classes, methods, properties, and constants
- **Extensible Architecture**: Designed to easily add support for other programming languages
- **Smart Detection**: Automatically detects the type of element (class, method, property, constant)
- **Namespace Resolution**: Properly handles PHP namespaces

## Supported Elements

### PHP
- **Classes**: `App\Models\User`
- **Methods**: `App\Models\User::getName`
- **Properties**: `App\Models\User::$name`
- **Constants**: `App\Models\User::STATUS_ACTIVE`

## Usage

1. Open a PHP file in VSCode
2. Place your cursor on a class name, method name, property, or constant
3. Right-click to open the context menu
4. Select "Copy FQCN"
5. The FQCN will be copied to your clipboard

Alternatively, you can use the Command Palette:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Copy FQCN"
3. Press Enter

## Configuration

The extension provides the following configuration options:

### `fqcnCopier.enabledLanguages`
- **Type**: `array`
- **Default**: `["php"]`
- **Description**: List of languages for which FQCN copying is enabled

### `fqcnCopier.showNotifications`
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Show notification when FQCN is copied to clipboard

## Examples

Given this PHP code:

```php
<?php

namespace App\Models;

class User
{
    private $name;
    public const STATUS_ACTIVE = 1;
    
    public function getName()
    {
        return $this->name;
    }
}
```

- Clicking on `User` (class name) copies: `App\Models\User`
- Clicking on `getName` copies: `App\Models\User::getName`
- Clicking on `$name` copies: `App\Models\User::$name`
- Clicking on `STATUS_ACTIVE` copies: `App\Models\User::STATUS_ACTIVE`

## Extension Architecture

The extension is built with extensibility in mind:

- **BaseProvider**: Abstract base class for language-specific providers
- **PHPProvider**: Concrete implementation for PHP language support
- **Provider Registry**: System to manage multiple language providers

## Adding Support for New Languages

To add support for a new programming language:

1. Create a new provider class extending `BaseProvider`
2. Implement the `extractFQCN` method for your language
3. Register the provider in the extension's initialization

Example:

```typescript
export class JavaScriptProvider extends BaseProvider {
    readonly languageId = 'javascript';
    
    async extractFQCN(document: vscode.TextDocument, position: vscode.Position): Promise<FQCNResult | null> {
        // Implement JavaScript-specific FQCN extraction logic
    }
}
```

## Requirements

- Visual Studio Code 1.74.0 or higher
- PHP files for PHP functionality

## Installation

### From VSIX (Development)
1. Download the `.vsix` file
2. Open VSCode
3. Go to Extensions view (`Ctrl+Shift+X`)
4. Click on the "..." menu and select "Install from VSIX..."
5. Select the downloaded `.vsix` file

### Development Setup
1. Clone this repository
2. Run `npm install` to install dependencies
3. Press `F5` to open a new Extension Development Host window
4. Test the extension in the new window

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This extension is released under the MIT License.

## Changelog

### 1.1.0
- Improved context menu positioning: "Copy FQCN" now appears in the first group for better accessibility
- Enhanced build documentation with Docker support
- Added comprehensive .vsix packaging instructions
- Updated development dependencies

### 1.0.0
- Initial release
- PHP support for classes, methods, properties, and constants
- Right-click context menu integration
- Configurable notifications
- Extensible architecture for future language support
