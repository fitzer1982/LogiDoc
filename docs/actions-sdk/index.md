---
slug: /actions-sdk/
sidebar_label: "Overview"
sidebar_position: 1
---

# Logi Actions SDK

Build powerful plugins for Logitech and Loupedeck devices. Create custom workflows, integrate with external services, and reach thousands of users through the official marketplace.

## 🚀 Quick Start

Get your first plugin running in under 5 minutes:

```bash
# Install the SDK tools
dotnet tool install --global LogiPluginTool

# Create your first plugin
logiplugintool generate MyFirstPlugin
cd MyFirstPlugin

# Build and test
dotnet build
```

**[→ Full Quick Start Guide](./quick-start.md)**

## 🎯 What You Can Build

- **Creative Workflows** - Streamline design and video editing tasks
- **Smart Home Control** - Integrate with IoT devices and home automation
- **API Integrations** - Connect to web services and cloud platforms  
- **System Monitoring** - Display real-time metrics and alerts
- **Gaming Tools** - Create custom game controls and overlays

## 📚 Documentation Structure

### Getting Started
- **[Overview](./overview.md)** - SDK capabilities and supported devices
- **[Getting Started](./getting-started.md)** - Prerequisites and account setup
- **[Installation](./installation.md)** - Install tools and create your first project
- **[Authentication](./authentication.md)** - API keys and security setup
- **[Quick Start](./quick-start.md)** - Build "Hello World" in 5 minutes

### Core Concepts
- **[Objects](./core-concepts/objects.md)** - Commands, adjustments, and plugin architecture
- **[Webhooks](./core-concepts/webhooks.md)** - Real-time external service integration
- **[Rate Limits](./core-concepts/rate-limits.md)** - Performance and API limits

### Guides & Tutorials
- **[Building Commands](./guides/payment-intents.md)** - Create interactive plugin commands
- **[Building Adjustments](./guides/save-cards.md)** - Handle encoder rotations and continuous controls
- **[Webhooks Integration](./guides/webhooks-guide.md)** - Receive real-time notifications

### Reference & Resources
- **[API Reference](./api-reference.md)** - Complete SDK class and method documentation
- **[Sample Projects](./samples.md)** - Real-world examples and code templates
- **[Error Handling](./error-handling.md)** - Best practices for robust plugins
- **[FAQ](./faq.md)** - Common questions and troubleshooting
- **[Release Notes](./release-notes.md)** - Latest updates and changes
- **[Support](./support.md)** - Get help and connect with the community

## 🏗️ World-Class Features

This documentation follows industry best practices for SDK documentation, including:

✅ **Progressive Disclosure** - From quick start to advanced concepts  
✅ **Task-Oriented Guides** - Real-world scenarios and solutions  
✅ **Complete API Reference** - Auto-generated from source code  
✅ **Interactive Examples** - Copy-paste code that works  
✅ **Community Resources** - Samples, support, and feedback channels  
✅ **Regular Updates** - Changelog and migration guides  

## 🌟 Featured Sample

```csharp
public class VolumeCommand : PluginDynamicCommand
{
    public VolumeCommand() : base(
        displayName: "System Volume",
        description: "Adjust system volume",
        groupName: "Audio")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        // Toggle system mute
        this.Plugin.ClientApplication.SendKeyboardShortcut(VirtualKeyCode.VolumeMute);
        
        // Update button appearance
        this.ActionImageChanged(actionParameter);
    }
}
```

**[→ More Examples](./samples.md)**

## 🚀 Ready to Start?

1. **New to the SDK?** → [Getting Started](./getting-started.md)
2. **Want to code immediately?** → [Quick Start](./quick-start.md)  
3. **Need API details?** → [API Reference](./api-reference.md)
4. **Looking for examples?** → [Sample Projects](./samples.md)

---

*Built with ❤️ by the Logitech Developer Team*