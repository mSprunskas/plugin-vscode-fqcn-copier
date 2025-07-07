# Change Log

All notable changes to the "FQCN Copier" extension will be documented in this file.

## [1.1.0] - 2025-01-07

### Changed
- Moved item to different place in right-click menu
- Updated development instructions

## [1.0.0] - 2025-01-04

### Added
- Initial release of FQCN Copier extension
- PHP language support for copying Fully Qualified Class Names
- Right-click context menu integration for PHP files
- Support for PHP classes, methods, properties, and constants
- Smart element type detection (class, method, property, constant)
- Namespace resolution for PHP files
- Configurable notification system
- Extensible architecture for future language support
- Command palette integration
- Configuration options:
  - `fqcnCopier.enabledLanguages`: Control which languages are supported
  - `fqcnCopier.showNotifications`: Toggle copy notifications

### Features
- **Classes**: Copy class FQCN (e.g., `App\Models\User`)
- **Methods**: Copy method FQCN (e.g., `App\Models\User::getName`)
- **Properties**: Copy property FQCN (e.g., `App\Models\User::$name`)
- **Constants**: Copy constant FQCN (e.g., `App\Models\User::STATUS_ACTIVE`)
- **Traits**: Support for PHP traits
- **Interfaces**: Support for PHP interfaces

### Technical
- TypeScript implementation with strict type checking
- Modular provider-based architecture
- Comprehensive PHP parsing with regex-based AST analysis
- Proper brace matching for class boundary detection
- Error handling and user feedback
