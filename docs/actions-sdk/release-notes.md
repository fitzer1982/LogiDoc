# Release Notes

Stay up-to-date with the latest changes, improvements, and new features in the Logi Actions SDK.

## Version 2.1.0 (Latest)
*Released: January 15, 2025*

### ✨ New Features
- Added support for Logitech MX Creative Dialpad
- New `BitmapBuilder` helper class for custom button graphics
- Enhanced logging with structured log levels
- Support for vector (SVG) images in commands

### 🔧 Improvements
- Improved hot reload performance during development
- Better error messages for common configuration issues
- Enhanced plugin packaging validation
- Optimized memory usage for large plugins

### 🐛 Bug Fixes
- Fixed issue with encoder reset functionality
- Resolved memory leak in image processing
- Fixed plugin loading on systems with non-English locales
- Corrected touch event handling on Live S devices

### 📖 Documentation
- Added comprehensive API reference
- New webhook integration guide
- Updated marketplace submission process
- Enhanced troubleshooting section

---

## Version 2.0.0
*Released: November 20, 2024*

### 🚀 Major Changes
- **Breaking Change**: Updated to .NET 8.0 requirement
- **Breaking Change**: Constructor changes for all command classes
- New plugin manifest format (v4)
- Redesigned authentication system

### ✨ New Features
- Support for Razer Stream Controller X
- Dynamic folder (Control Center) functionality
- Profile actions with user-configurable parameters
- Plugin settings with cloud backup
- Multi-state commands

### 🔧 Improvements
- 50% faster plugin loading times
- Improved device communication reliability
- Better error handling and recovery
- Enhanced plugin isolation

### 📦 Migration Guide
See our [Migration Guide](./api-reference.md#migration-guide) for detailed upgrade instructions.

---

## Version 1.5.2
*Released: September 10, 2024*

### 🐛 Bug Fixes
- Fixed plugin service crash on Windows 11 24H2
- Resolved USB connection issues with CT devices
- Fixed image scaling on high-DPI displays

---

## Version 1.5.0
*Released: August 15, 2024*

### ✨ New Features
- Icon template system for consistent branding
- Plugin localization support
- Enhanced marketplace approval process

### 🔧 Improvements
- Reduced plugin startup time by 30%
- Better handling of device disconnections
- Improved plugin debugging experience

---

## Upcoming Features

### Version 2.2.0 (Q2 2025)
- Web-based plugin development tools
- JavaScript/TypeScript SDK (beta)
- Enhanced device simulation for testing
- Plugin analytics and usage metrics

### Version 2.3.0 (Q3 2025)
- Cloud-based plugin distribution
- Advanced gesture recognition
- Multi-device plugin synchronization

---

## Breaking Changes Summary

### v2.0.0 → v2.1.0
- No breaking changes

### v1.x → v2.0.0
- .NET 8.0 required (was .NET 6.0)
- Command constructors now require explicit parameters
- Plugin manifest format updated to v4
- Some API methods renamed for consistency

---

## Support Policy

- **Current Version (2.1.x)**: Full support with regular updates
- **Previous Version (2.0.x)**: Security updates only
- **Legacy Versions (1.x)**: End of life - upgrade recommended

---

## Getting Updates

### Automatic Updates
The LogiPluginTool automatically checks for updates. Enable auto-updates with:
```bash
logiplugintool config --auto-update true
```

### Manual Updates
```bash
dotnet tool update --global LogiPluginTool
```

### Release Notifications
- 📧 [Subscribe to release notifications](https://developer.logitech.com/notifications)
- 📱 Follow [@LogitechDev](https://twitter.com/LogitechDev) on Twitter
- 📰 Check the [Developer Blog](https://developer.logitech.com/blog)

---

## Feedback

Found a bug or have a feature request?
- 🐛 [Report bugs](https://github.com/logitech/actions-sdk/issues)
- 💡 [Request features](https://github.com/logitech/actions-sdk/discussions)
- 📧 [Contact support](./support.md)

---

*For detailed technical changes, see the [GitHub Changelog](https://github.com/logitech/actions-sdk/blob/main/CHANGELOG.md).*