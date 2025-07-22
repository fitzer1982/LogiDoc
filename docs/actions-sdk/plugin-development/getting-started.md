# Getting Started

Welcome to plugin development with the Logi Actions SDK! This guide will walk you through setting up your development environment and creating your first plugin.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Visual Studio 2019 or later** (Community edition is sufficient)
* **.NET Framework 4.7.2 or later**
* **Logitech G HUB software** (for testing your plugins)
* **Basic knowledge of C# programming**

## Setting Up Your Development Environment

### 1. Install Visual Studio

Download and install Visual Studio from the [official Microsoft website](https://visualstudio.microsoft.com/). During installation, make sure to include:

* **.NET desktop development** workload
* **C# and Visual Basic** development tools

### 2. Install the Logi Actions SDK

1. Download the Logi Actions SDK from the [Logitech Developer Portal](https://www.logitech.com/en-hk/software/marketplace/developer.html)
2. Extract the SDK to a location on your computer
3. Add the SDK references to your project (see Project Setup below)

### 3. Install Logitech G HUB

Download and install [Logitech G HUB](https://www.logitechg.com/en-us/innovation/g-hub.html) to test your plugins with supported devices.

## Creating Your First Plugin Project

### 1. Create a New Project

1. Open Visual Studio
2. Click **Create a new project**
3. Select **Class Library (.NET Framework)**
4. Name your project (e.g., "MyFirstPlugin")
5. Choose **.NET Framework 4.7.2** or later

### 2. Add SDK References

1. Right-click on your project in Solution Explorer
2. Select **Add** → **Reference**
3. Browse to the Logi Actions SDK folder
4. Add the following DLLs:
   * `LogiActionsSDK.dll`
   * `LogiActionsSDK.Core.dll`

### 3. Create Your Plugin Class

Replace the default `Class1.cs` with your plugin class:

```csharp
using LogiActionsSDK;
using System;

namespace MyFirstPlugin
{
    public class MyPlugin : Plugin
    {
        public override void Initialize()
        {
            // This method is called when your plugin is loaded
            Console.WriteLine("My First Plugin initialized!");
            
            // Add your first command
            AddCommand("HelloWorld", "Say Hello", () => {
                Console.WriteLine("Hello from my plugin!");
            });
        }
        
        public override string GetName()
        {
            return "My First Plugin";
        }
        
        public override string GetVersion()
        {
            return "1.0.0";
        }
    }
}
```

### 4. Build Your Plugin

1. Build your project in Visual Studio (Build → Build Solution)
2. The compiled DLL will be in the `bin/Debug` or `bin/Release` folder

## Testing Your Plugin

### 1. Install the Plugin

1. Copy your compiled DLL to the Logi Actions plugin directory:
   * **Windows**: `%APPDATA%\Logitech\Logi Actions\Plugins\`
   * **macOS**: `~/Library/Application Support/Logitech/Logi Actions/Plugins/`

2. Restart Logitech G HUB

### 2. Verify Installation

1. Open Logitech G HUB
2. Go to the **Actions** section
3. Your plugin should appear in the list of available plugins
4. You can assign your "HelloWorld" command to device buttons

## Next Steps

Now that you have created your first plugin, explore these topics:

* [Testing and Debugging](./testing-and-debugging.md) - Learn how to test and debug your plugins
* [Plugin Structure](../tutorial/plugin-structure.md) - Understand the structure of a Logi Actions plugin
* [Adding Commands](../tutorial/add-simple-command.md) - Learn how to add more commands to your plugin

## Troubleshooting

### Common Issues

**Plugin not appearing in G HUB:**
* Ensure the DLL is in the correct plugins directory
* Check that the plugin class inherits from `Plugin`
* Verify the `Initialize()` method is properly implemented
* Restart G HUB after installing the plugin

**Build errors:**
* Verify all SDK references are correctly added
* Ensure you're using .NET Framework 4.7.2 or later
* Check that the SDK DLLs are accessible

**Runtime errors:**
* Check the G HUB logs for error messages
* Verify your plugin code doesn't throw unhandled exceptions
* Test with a simple command first

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](../troubleshooting.md) guide
2. Review the [API Reference](../api-reference.md)
3. Visit the [Logitech Developer Forums](https://community.logitech.com/)
4. Check the [GitHub Issues](https://github.com/logitech/actions-sdk/issues) page 