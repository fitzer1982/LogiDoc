# Frequently Asked Questions

Common questions and answers about the Logi Actions SDK.

## Getting Started

### Q: What devices are supported?
A: The SDK supports Logitech MX Creative Console, Loupedeck CT, Live, Live S, and Razer Stream Controllers.

### Q: Do I need a paid license?
A: No, the SDK is free to use for development and distribution.

### Q: What programming languages are supported?
A: Currently only C# with .NET 8.0+.

## Development

### Q: Why isn't my plugin appearing?
A: Check that:
- The build completed without errors
- The .link file exists in the plugins directory
- You've restarted the Logi Plugin Service
- The plugin is enabled in settings

### Q: How do I debug my plugin?
A: Use Visual Studio or VS Code with the C# debugger. Set breakpoints in your plugin code and use F5 to debug.

### Q: Can I use async/await in commands?
A: Yes, but don't block the UI thread. Use `Task.Run()` for long-running operations.

## Distribution

### Q: How do I submit to the marketplace?
A: Package your plugin with `logiplugintool pack` and submit via the [marketplace portal](https://marketplace.logitech.com/contribute).

### Q: What are the approval requirements?
A: See our [Marketplace Approval Guidelines](./plugin-development/marketplace-approval-guidelines.md).

## Troubleshooting

### Q: My plugin crashes on startup
A: Check the logs in the Logi Plugin Service directory and ensure all dependencies are included.

### Q: API calls are failing
A: Verify your API keys, check network connectivity, and implement proper error handling.

## Need More Help?

- 📧 [Developer Support](./support.md)
- 💬 [Community Forum](https://community.logitech.com/developers)
- 📖 [Full Documentation](./overview.md)