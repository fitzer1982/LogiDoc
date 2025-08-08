# Quick Start

Build your first Logi Actions plugin in 5 minutes. This guide walks you through creating a simple "Hello World" plugin that displays a custom button on your device.

:::info Prerequisites
Make sure you've completed [Installation](./installation.md) before starting.
:::

## Step 1: Create Your First Plugin

Generate a new plugin project:

```bash
logiplugintool generate HelloWorldPlugin
cd HelloWorldPlugin
```

## Step 2: Understand the Project Structure

```
HelloWorldPlugin/
├── src/
│   ├── HelloWorldPlugin.cs          # Main plugin class
│   ├── HelloWorldApplication.cs     # Application integration
│   ├── Commands/
│   │   └── HelloCommand.cs          # Your first command
│   └── HelloWorldPlugin.csproj      # Project file
├── metadata/
│   ├── LoupedeckPackage.yaml        # Plugin manifest
│   └── Icon256x256.png              # Plugin icon
└── README.md
```

## Step 3: Build and Test

Build your plugin:

```bash
dotnet build
```

The build automatically creates a `.link` file that registers your plugin with the Logi Plugin Service.

## Step 4: Load in Host Software

1. **Restart Plugin Service**: In Logitech Options+ or Loupedeck Software settings, click "Restart Logi Plugin Service"
2. **Find Your Plugin**: Navigate to the plugin list and look for "HelloWorldPlugin"
3. **Enable Plugin**: Make sure it's enabled and visible

## Step 5: Test on Device

1. Connect your supported device
2. Look for the "Hello World" button
3. Press it to see your first plugin in action!

## Code Walkthrough

### Main Plugin Class

```csharp title="src/HelloWorldPlugin.cs"
using Loupedeck;

namespace HelloWorldPlugin
{
    public class HelloWorldPlugin : Plugin
    {
        public override void Load()
        {
            // Plugin initialization code
            this.Info.DisplayName = "Hello World Plugin";
            this.Info.Description = "My first Logi Actions plugin";
        }

        public override void Unload()
        {
            // Cleanup code
        }
    }
}
```

### Simple Command

```csharp title="src/Commands/HelloCommand.cs"
using Loupedeck;

namespace HelloWorldPlugin.Commands
{
    public class HelloCommand : PluginDynamicCommand
    {
        public HelloCommand() : base(
            displayName: "Hello World",
            description: "Shows a hello message",
            groupName: "Demo")
        {
        }

        protected override void RunCommand(string actionParameter)
        {
            // This runs when the button is pressed
            System.Windows.Forms.MessageBox.Show(
                "Hello from your first plugin!",
                "Hello World",
                System.Windows.Forms.MessageBoxButtons.OK
            );
        }
    }
}
```

## Language Examples

### C# (Primary)

```csharp
public class MyCommand : PluginDynamicCommand
{
    public MyCommand() : base("My Button", "Does something cool", "My Group")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        // Your code here
        Console.WriteLine("Button pressed!");
    }
}
```

### Plugin Manifest (YAML)

```yaml title="metadata/LoupedeckPackage.yaml"
type: plugin4
name: HelloWorldPlugin
displayName: Hello World Plugin
version: 1.0.0
author: Your Name
copyright: © 2025 Your Name
license: MIT
licenseUrl: https://opensource.org/licenses/MIT
supportPageUrl: mailto:your.email@example.com
pluginFileName: HelloWorldPlugin.dll
pluginFolderWin: bin/win/
pluginFolderMac: bin/mac/
supportedDevices:
  - LoupedeckCt
  - LoupedeckLive
  - MxCreativeConsole
```

## Hot Reload Development

Enable hot reload for faster development:

```bash
cd src
dotnet watch build
```

Now your plugin automatically rebuilds and reloads when you save changes!

## Customization Options

### Add Custom Icon

Replace `metadata/Icon256x256.png` with your custom 256x256 pixel PNG icon.

### Add More Commands

Create additional command classes in the `Commands/` folder:

```csharp
public class SecondCommand : PluginDynamicCommand
{
    public SecondCommand() : base("Second Button", "Another action", "Demo")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        // Different action
    }
}
```

### Handle Device Events

```csharp
public class MyAdjustment : PluginDynamicAdjustment
{
    public MyAdjustment() : base("Volume", "Adjust volume", "Audio")
    {
    }

    protected override void ApplyAdjustment(string actionParameter, int diff)
    {
        // Handle encoder rotation
        var newVolume = GetCurrentVolume() + diff;
        SetSystemVolume(newVolume);
    }
}
```

## Testing Checklist

- [ ] Plugin appears in Options+/Loupedeck Software
- [ ] Button shows correct name and icon
- [ ] Button responds to presses
- [ ] No error messages in logs
- [ ] Hot reload works during development

## Common Issues

### Plugin Not Appearing

1. Check build output for errors
2. Verify `.link` file exists in plugins directory
3. Restart Logi Plugin Service
4. Check plugin is enabled in settings

### Button Not Working

1. Verify `RunCommand` method is implemented
2. Check for exceptions in debug output
3. Ensure device is properly connected

## Next Steps

🎉 **Congratulations!** You've built your first plugin.

**What's next?**

- 📚 **Learn the fundamentals**: [Core Concepts](./core-concepts/objects.md)
- 🔧 **Add more features**: [Guides & Tutorials](./guides/payment-intents.md)
- 📖 **Explore the API**: [API Reference](./api-reference.md)
- 🎨 **See examples**: [Sample Projects](./samples.md)

## Interactive Playground

:::tip Try it online
Want to experiment without installing anything? Try our [online playground](https://playground.logitech.dev) with live device simulation.
:::

---

*Total time: 5 minutes* | *Difficulty: Beginner*