# Development and Installation Guide

## VSCode FQCN Copier Extension

This guide explains how to install and test the FQCN Copier extension for Visual Studio Code.

## Installation Methods

### Method 1: Development Installation (Recommended for Testing)

1. **Open the project in VSCode**
   ```bash
   cd /home/marius/Projects/plugin-vscode-fqcn
   code .
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Compile the TypeScript code**
   ```bash
   npm run compile
   ```

4. **Test the extension**
   - Press `F5` in VSCode to open a new Extension Development Host window
   - The extension will be automatically loaded in the new window
   - Open a PHP file (like `test-sample.php`) in the new window
   - Test the functionality by right-clicking on PHP elements

### Method 2: Package and Install

1. **Package the extension** (requires Node.js 20+ for vsce)
   ```bash
   npx @vscode/vsce package
   ```
   This will create a `.vsix` file.

2. **Install the packaged extension**
   - Open VSCode
   - Go to Extensions view (`Ctrl+Shift+X`)
   - Click the "..." menu and select "Install from VSIX..."
   - Select the generated `.vsix` file

## Testing the Extension

### Test File
Use the provided `test-sample.php` file to test various scenarios:

```php
<?php

namespace App\Models;

class User
{
    private $name;
    public const STATUS_ACTIVE = 1;
    
    public function getName(): string
    {
        return $this->name;
    }
}
```

### Test Cases

1. **Class FQCN**: Click on `User` → Should copy `App\Models\User`
2. **Method FQCN**: Click on `getName` → Should copy `App\Models\User::getName`
3. **Property FQCN**: Click on `$name` → Should copy `App\Models\User::$name`
4. **Constant FQCN**: Click on `STATUS_ACTIVE` → Should copy `App\Models\User::STATUS_ACTIVE`

### How to Test

1. Open a PHP file in VSCode
2. Place your cursor on a class name, method name, property, or constant
3. Right-click to open the context menu
4. Select "Copy FQCN"
5. The FQCN should be copied to your clipboard
6. You should see a notification showing what was copied (if notifications are enabled)

### Alternative Testing Method

You can also use the Command Palette:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Copy FQCN"
3. Press Enter

## Configuration

The extension provides these configuration options:

- `fqcnCopier.enabledLanguages`: Array of languages (default: `["php"]`)
- `fqcnCopier.showNotifications`: Boolean to show/hide notifications (default: `true`)

Access these via File → Preferences → Settings, then search for "FQCN".

## Prerequisites

- Visual Studio Code 1.74.0 or higher
- Node.js 16.x or higher
- npm or yarn package manager
- `@vscode/vsce` (Visual Studio Code Extension Manager) for packaging

Install vsce globally:
```bash
npm install -g @vscode/vsce
```

## Development Commands

### Local Development Build

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch
```

## Building .vsix File

The extension can be packaged into a `.vsix` file for distribution using two methods:

### Method 1: Local Build

```bash
# Install dependencies (if not already done)
npm install

# Compile the extension
npm run compile

# Package into .vsix file
npm run package
```

This will create a `vscode-fqcn-copier-1.1.0.vsix` file in the project root.

### Method 2: Docker Build (Recommended for Consistent Environment)

The project includes a Dockerfile for creating a consistent build environment with Node.js 20 Alpine.

#### Build the Docker image:
```bash
docker build -t vscode-fqcn-builder .
```

#### Run the container with project mounted:
```bash
docker run -itd --user root -v ./:/home/app/src --rm --name fqcn-builder vscode-fqcn-builder
```

#### Execute build commands inside the container:
```bash
# Enter the container
docker exec -it fqcn-builder sh

# Inside the container, run:
npm install
npm run compile
npm run package

# Exit the container
exit
```

#### Alternative one-liner for Docker build:
```bash
docker run --rm -v ./:/home/app/src vscode-fqcn-builder sh -c "npm install && npm run compile && npm run package"
```

### Docker Development Environment

The included Dockerfile provides:
- **Node.js 20 Alpine**: Lightweight, consistent environment
- **Non-root user**: Security best practices
- **Volume mounting**: Live code editing while using containerized build tools

Benefits of using Docker for building:
- **Consistency**: Same Node.js version across different development machines
- **Isolation**: Doesn't interfere with your local Node.js setup
- **Reproducibility**: Ensures builds work the same way for all contributors

### Build Output

After successful packaging, you'll find:
- `vscode-fqcn-copier-1.1.0.vsix` - The packaged extension file
- `out/` directory - Compiled JavaScript files

The `.vsix` file can be installed directly in VS Code or distributed to users.

## Project Structure

```
plugin-vscode-fqcn/
├── package.json              # Extension manifest
├── src/
│   ├── extension.ts          # Main extension entry point
│   └── providers/
│       ├── base-provider.ts  # Abstract base class
│       └── php-provider.ts   # PHP-specific implementation
├── out/                      # Compiled JavaScript files
├── README.md                 # User documentation
├── CHANGELOG.md              # Version history
└── test-sample.php           # Test file
```

## Troubleshooting

### Extension Not Loading
- Make sure you compiled the TypeScript code: `npm run compile`
- Check the VSCode Developer Console for errors: Help → Toggle Developer Tools

### Context Menu Not Appearing
- Ensure you're in a PHP file (`.php` extension)
- Check that the extension is activated in the Extensions view

### FQCN Not Detected
- Make sure your cursor is positioned on a valid PHP element (class, method, property, constant)
- Verify the PHP file has proper namespace and class structure

### Compilation Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript version compatibility
- Verify Node.js version (extension development works with Node.js 16+, but packaging requires 20+)

## Adding Support for New Languages

To extend the extension for other programming languages:

1. Create a new provider class extending `BaseProvider`
2. Implement the `extractFQCN` method for your language
3. Register the provider in `src/extension.ts`

Example:
```typescript
export class JavaScriptProvider extends BaseProvider {
    readonly languageId = 'javascript';
    
    async extractFQCN(document: vscode.TextDocument, position: vscode.Position): Promise<FQCNResult | null> {
        // Implement JavaScript-specific logic
    }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This extension is released under the MIT License.
