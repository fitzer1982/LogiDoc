# Plugin Structure

Understanding the structure of a Logi Actions plugin is essential for creating well-organized and maintainable code. This guide explains the key components and organization of a plugin.

## Basic Plugin Structure

A Logi Actions plugin consists of several key components:

```csharp
using LogiActionsSDK;
using System;

namespace MyPlugin
{
    public class MyPlugin : Plugin
    {
        // Plugin metadata
        public override string GetName() => "My Plugin";
        public override string GetVersion() => "1.0.0";
        public override string GetDescription() => "A sample plugin";
        public override string GetAuthor() => "Your Name";

        // Main initialization method
        public override void Initialize()
        {
            // Plugin initialization code
            RegisterCommands();
            RegisterAdjustments();
            SetupEventHandlers();
        }

        // Plugin cleanup
        public override void Dispose()
        {
            // Cleanup code
            base.Dispose();
        }
    }
}
```

## Required Components

### 1. Plugin Class

Every plugin must have a main class that inherits from `Plugin`:

```csharp
public class MyPlugin : Plugin
{
    // Your plugin implementation
}
```

### 2. Required Override Methods

#### GetName()
Returns the display name of your plugin:

```csharp
public override string GetName()
{
    return "My Plugin";
}
```

#### GetVersion()
Returns the version number of your plugin:

```csharp
public override string GetVersion()
{
    return "1.0.0"; // Use semantic versioning
}
```

#### Initialize()
Called when the plugin is loaded. This is where you set up your plugin:

```csharp
public override void Initialize()
{
    // Add commands and adjustments here
    AddCommand("MyCommand", "My Command", () => {
        // Command logic
    });
}
```

## Optional Components

### 1. GetDescription()
Provides a description of your plugin:

```csharp
public override string GetDescription()
{
    return "A comprehensive plugin for creative workflows";
}
```

### 2. GetAuthor()
Specifies the plugin author:

```csharp
public override string GetAuthor()
{
    return "Your Name";
}
```

### 3. Dispose()
Called when the plugin is unloaded. Use this for cleanup:

```csharp
public override void Dispose()
{
    // Clean up resources
    // Close files, dispose objects, etc.
    base.Dispose();
}
```

## Organizing Your Plugin

### 1. Command Registration

Organize your commands in a dedicated method:

```csharp
private void RegisterCommands()
{
    AddCommand("Command1", "First Command", () => {
        // Command 1 logic
    });
    
    AddCommand("Command2", "Second Command", () => {
        // Command 2 logic
    });
}
```

### 2. Adjustment Registration

Organize your adjustments similarly:

```csharp
private void RegisterAdjustments()
{
    AddAdjustment("Adjustment1", "First Adjustment", (value) => {
        // Adjustment 1 logic
    });
    
    AddAdjustment("Adjustment2", "Second Adjustment", (value) => {
        // Adjustment 2 logic
    });
}
```

### 3. Event Handlers

Set up event handlers for device events:

```csharp
private void SetupEventHandlers()
{
    // Handle device connection events
    OnDeviceConnected += (device) => {
        Console.WriteLine($"Device connected: {device.Name}");
    };
    
    OnDeviceDisconnected += (device) => {
        Console.WriteLine($"Device disconnected: {device.Name}");
    };
}
```

## Advanced Structure

### 1. Multiple Classes

For complex plugins, organize code into multiple classes:

```csharp
public class MyPlugin : Plugin
{
    private CommandManager commandManager;
    private AdjustmentManager adjustmentManager;
    private SettingsManager settingsManager;

    public override void Initialize()
    {
        // Initialize managers
        commandManager = new CommandManager(this);
        adjustmentManager = new AdjustmentManager(this);
        settingsManager = new SettingsManager();
        
        // Register components
        commandManager.RegisterCommands();
        adjustmentManager.RegisterAdjustments();
    }
}

public class CommandManager
{
    private Plugin plugin;
    
    public CommandManager(Plugin plugin)
    {
        this.plugin = plugin;
    }
    
    public void RegisterCommands()
    {
        // Register commands using the plugin reference
    }
}
```

### 2. Configuration Management

Handle plugin configuration:

```csharp
public class MyPlugin : Plugin
{
    private PluginConfig config;
    
    public override void Initialize()
    {
        LoadConfiguration();
        RegisterCommands();
    }
    
    private void LoadConfiguration()
    {
        config = PluginConfig.Load("config.json");
    }
    
    private void RegisterCommands()
    {
        if (config.EnableFeature1)
        {
            AddCommand("Feature1", "Feature 1", () => {
                // Feature 1 logic
            });
        }
    }
}
```

### 3. State Management

Manage plugin state:

```csharp
public class MyPlugin : Plugin
{
    private bool isEnabled = true;
    private Dictionary<string, object> state = new Dictionary<string, object>();
    
    public override void Initialize()
    {
        LoadState();
        RegisterCommands();
    }
    
    private void LoadState()
    {
        // Load saved state from file or registry
    }
    
    private void SaveState()
    {
        // Save current state
    }
    
    public override void Dispose()
    {
        SaveState();
        base.Dispose();
    }
}
```

## Best Practices

### 1. Separation of Concerns

Keep different aspects of your plugin separate:

```csharp
public class MyPlugin : Plugin
{
    // UI-related commands
    private void RegisterUICommands()
    {
        AddCommand("ShowDialog", "Show Dialog", () => {
            // UI logic
        });
    }
    
    // System-related commands
    private void RegisterSystemCommands()
    {
        AddCommand("SystemInfo", "System Info", () => {
            // System logic
        });
    }
    
    // File-related commands
    private void RegisterFileCommands()
    {
        AddCommand("SaveFile", "Save File", () => {
            // File logic
        });
    }
}
```

### 2. Error Handling

Implement proper error handling:

```csharp
public override void Initialize()
{
    try
    {
        RegisterCommands();
        RegisterAdjustments();
        Console.WriteLine("Plugin initialized successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Plugin initialization failed: {ex.Message}");
        // Don't throw - let the plugin load with reduced functionality
    }
}
```

### 3. Logging

Add logging for debugging:

```csharp
public class MyPlugin : Plugin
{
    private void Log(string message)
    {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {message}");
    }
    
    public override void Initialize()
    {
        Log("Plugin initialization started");
        
        RegisterCommands();
        
        Log("Plugin initialization completed");
    }
}
```

## File Organization

Organize your plugin files logically:

```
MyPlugin/
├── MyPlugin.cs              # Main plugin class
├── Commands/
│   ├── UICommands.cs        # UI-related commands
│   ├── SystemCommands.cs    # System-related commands
│   └── FileCommands.cs      # File-related commands
├── Adjustments/
│   ├── VolumeAdjustments.cs # Volume-related adjustments
│   └── BrightnessAdjustments.cs # Brightness adjustments
├── Managers/
│   ├── CommandManager.cs    # Command management
│   ├── AdjustmentManager.cs # Adjustment management
│   └── SettingsManager.cs   # Settings management
├── Models/
│   ├── PluginConfig.cs      # Configuration model
│   └── PluginState.cs       # State model
└── Utils/
    ├── Logger.cs            # Logging utilities
    └── FileUtils.cs         # File utilities
```

## Next Steps

* [Add a Simple Command](../tutorial/add-simple-command.md) - Learn how to add commands to your plugin
* [Add a Simple Adjustment](../tutorial/add-simple-adjustment.md) - Learn how to add adjustments
* [Plugin Features](../plugin-features/manage-plugin-settings.md) - Advanced plugin features 