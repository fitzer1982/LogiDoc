# Logi Actions SDK

Welcome, developers, to the Logi Actions SDK! This powerful toolkit allows you to create custom plugins that enhance the functionality of devices like the Logitech MX Creative Console and Loupedeck CT, Live, and Live S. Whether you're extending your workflow, adding new creative tools, or building innovative integrations, the Logi Actions SDK provides the flexibility and support you need to bring your ideas to life.

Built on the foundation of the Loupedeck SDK, the Logi Actions SDK leverages the power of C# to allow developers to create robust and customizable plugins. With our SDK, you can unlock the potential of these versatile devices, adding new features and controls tailored to a variety of professional and creative environments.

## What You Can Do with Logi Actions SDK

From this documentation, you will find everything you need to:

* **Create your own plugin project:** Set up your development environment and learn the essential building blocks for plugin development.
* **Develop and test your plugin:** Dive into the key components, APIs, and workflows that make up a Logi Actions plugin.
* **Package and distribute your plugin:** Learn how to package your plugin for distribution, ensuring it works smoothly for others.
* **Submit to the Logitech Marketplace:** Share your plugin with a growing community of users through the Logitech Marketplace, where it can help others elevate their creativity and productivity.

We're excited to see what you'll build with the Logi Actions SDK! Explore the documentation to get started on your journey toward creating incredible custom plugins.

## Supported Devices

The Logi Actions SDK supports the following devices:

* **Logitech MX Creative Console**
* **Loupedeck CT**
* **Loupedeck Live**
* **Loupedeck Live S**

## Getting Started

To begin developing plugins with the Logi Actions SDK:

1. **Set up your development environment** with Visual Studio and the required tools
2. **Create your first plugin project** following the plugin structure guidelines
3. **Add simple commands and adjustments** to understand the basics
4. **Test and debug your plugin** using the provided tools
5. **Package and distribute** your plugin to users

## Prerequisites

* Visual Studio 2019 or later
* .NET Framework 4.7.2 or later
* Basic knowledge of C# programming
* Logitech G HUB software (for testing)

## Quick Start

```csharp
using LogiActionsSDK;

namespace MyFirstPlugin
{
    public class MyPlugin : Plugin
    {
        public override void Initialize()
        {
            // Add your plugin initialization code here
            AddCommand("MyCommand", "My First Command", () => {
                // Command logic here
                Console.WriteLine("Hello from my plugin!");
            });
        }
    }
}
```

## Next Steps

- [Plugin Development](./plugin-development/getting-started.md)
- [Tutorial](./tutorial/plugin-structure.md)
- [Plugin Features](./plugin-features/manage-plugin-settings.md) 