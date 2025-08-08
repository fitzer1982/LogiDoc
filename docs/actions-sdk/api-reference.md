# API Reference

Complete reference documentation for the Logi Actions SDK classes, methods, and interfaces.

:::info Auto-Generated Documentation
This API reference is automatically generated from source code. For the most up-to-date information, refer to the inline documentation in your IDE.
:::

## Core Classes

### Plugin

The base class for all Logi Actions plugins.

```csharp
public abstract class Plugin
{
    public PluginInfo Info { get; }
    public Assembly Assembly { get; }
    public ILogger Log { get; }
    
    public abstract void Load();
    public abstract void Unload();
    
    // Settings management
    protected bool TryGetPluginSetting(string settingName, out string settingValue);
    protected void SetPluginSetting(string settingName, string settingValue, bool backupOnline);
    protected void DeletePluginSetting(string settingName);
    protected string[] ListPluginSettings();
    
    // Status management
    public void OnPluginStatusChanged(PluginStatus status, string message, string supportUrl);
    
    // Data directory
    public string GetPluginDataDirectory();
}
```

#### Methods

##### Load()
Called when the plugin is loaded. Override to initialize your plugin.

```csharp
public override void Load()
{
    this.Info.DisplayName = "My Plugin";
    this.Info.Description = "Plugin description";
}
```

##### Unload()
Called when the plugin is unloaded. Override to clean up resources.

```csharp
public override void Unload()
{
    // Dispose resources
    _httpClient?.Dispose();
}
```

##### TryGetPluginSetting(string, out string)
Retrieves a plugin setting value.

**Parameters:**
- `settingName` (string): The setting name
- `settingValue` (out string): The setting value if found

**Returns:** `bool` - True if setting exists, false otherwise

##### SetPluginSetting(string, string, bool)
Stores a plugin setting.

**Parameters:**
- `settingName` (string): The setting name
- `settingValue` (string): The setting value
- `backupOnline` (bool): Whether to backup to cloud

### PluginDynamicCommand

Base class for creating interactive commands.

```csharp
public abstract class PluginDynamicCommand
{
    protected PluginDynamicCommand(string displayName, string description, string groupName);
    protected PluginDynamicCommand(); // For parameterized commands
    
    // Core methods
    protected abstract void RunCommand(string actionParameter);
    
    // Display customization
    protected virtual string GetCommandDisplayName(string actionParameter, PluginImageSize imageSize);
    protected virtual BitmapImage GetCommandImage(string actionParameter, PluginImageSize imageSize);
    
    // Parameter management
    protected void AddParameter(string actionParameter, string displayName, string groupName);
    
    // State notifications
    protected void ActionImageChanged(string actionParameter = null);
    
    // Properties
    public Plugin Plugin { get; }
    public string DisplayName { get; }
    public string Description { get; }
    public string GroupName { get; }
}
```

#### Methods

##### RunCommand(string)
**Abstract method** - Executed when the command is triggered.

**Parameters:**
- `actionParameter` (string): Parameter identifying the specific action instance

```csharp
protected override void RunCommand(string actionParameter)
{
    // Your command logic here
    Console.WriteLine($"Command executed with parameter: {actionParameter}");
}
```

##### GetCommandDisplayName(string, PluginImageSize)
**Virtual method** - Returns the display name for the command.

**Parameters:**
- `actionParameter` (string): The action parameter
- `imageSize` (PluginImageSize): The target image size

**Returns:** `string` - The display name

##### GetCommandImage(string, PluginImageSize)
**Virtual method** - Returns a custom image for the command.

**Parameters:**
- `actionParameter` (string): The action parameter
- `imageSize` (PluginImageSize): The target image size

**Returns:** `BitmapImage` - The command image

##### AddParameter(string, string, string)
Adds a parameter option for the command.

**Parameters:**
- `actionParameter` (string): The parameter value
- `displayName` (string): Display name for the parameter
- `groupName` (string): Group name for organization

### PluginDynamicAdjustment

Base class for creating encoder adjustments.

```csharp
public abstract class PluginDynamicAdjustment
{
    protected PluginDynamicAdjustment(string displayName, string description, string groupName, bool hasReset = false);
    
    // Core methods
    protected abstract void ApplyAdjustment(string actionParameter, int diff);
    protected virtual void RunCommand(string actionParameter); // For encoder press
    
    // Value display
    protected virtual string GetAdjustmentValue(string actionParameter);
    protected virtual string GetAdjustmentDisplayName(string actionParameter, PluginImageSize imageSize);
    protected virtual BitmapImage GetAdjustmentImage(string actionParameter, PluginImageSize imageSize);
    
    // State notifications
    protected void AdjustmentValueChanged(string actionParameter = null);
    
    // Properties
    public bool HasReset { get; }
}
```

#### Methods

##### ApplyAdjustment(string, int)
**Abstract method** - Called when encoder is rotated.

**Parameters:**
- `actionParameter` (string): The action parameter
- `diff` (int): Rotation amount (positive = clockwise, negative = counter-clockwise)

```csharp
protected override void ApplyAdjustment(string actionParameter, int diff)
{
    var currentValue = GetCurrentValue();
    var newValue = Math.Max(0, Math.Min(100, currentValue + diff));
    SetValue(newValue);
    
    this.AdjustmentValueChanged(actionParameter);
}
```

##### RunCommand(string)
**Virtual method** - Called when encoder is pressed (if HasReset = true).

##### GetAdjustmentValue(string)
**Virtual method** - Returns the current value to display near the encoder.

**Returns:** `string` - The value to display

### ClientApplication

Base class for application-specific plugins.

```csharp
public abstract class ClientApplication
{
    // Application identification
    protected virtual string GetProcessName();
    protected virtual string[] GetProcessNames();
    protected virtual string GetBundleId(); // macOS
    protected virtual bool IsProcessNameSupported(string processName);
    
    // Application events
    public event EventHandler ApplicationStarted;
    public event EventHandler ApplicationStopped;
    
    // Utility methods
    public void SendKeyboardShortcut(VirtualKeyCode keyCode);
    public void SendKeyboardShortcut(VirtualKeyCode[] keyCodes);
}
```

## Enumerations

### PluginStatus

```csharp
public enum PluginStatus
{
    Normal,
    Warning,
    Error
}
```

### PluginImageSize

```csharp
public enum PluginImageSize
{
    Width60 = 60,
    Width80 = 80,
    Width90 = 90
}
```

### VirtualKeyCode

Common virtual key codes for keyboard shortcuts:

```csharp
public enum VirtualKeyCode
{
    // Media keys
    VolumeUp,
    VolumeDown,
    VolumeMute,
    MediaPlayPause,
    MediaNextTrack,
    MediaPreviousTrack,
    
    // Function keys
    F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12,
    
    // Modifier keys
    Control,
    Alt,
    Shift,
    Windows,
    
    // Common keys
    Enter,
    Escape,
    Space,
    Tab,
    Backspace,
    Delete
}
```

## Interfaces

### ILogger

```csharp
public interface ILogger
{
    void Verbose(string message);
    void Info(string message);
    void Warning(string message);
    void Error(string message);
    void Error(Exception exception, string message);
}
```

## Utility Classes

### BitmapBuilder

Helper class for creating custom button images.

```csharp
public class BitmapBuilder : IDisposable
{
    public BitmapBuilder(PluginImageSize imageSize);
    
    // Background
    public void Clear(Color color);
    public void SetBackgroundImage(BitmapImage image);
    
    // Drawing
    public void DrawText(string text, Color? color = null, int? fontSize = null);
    public void DrawText(string text, int x, int y, int width, int height, Color? color = null, int? fontSize = null);
    public void DrawImage(BitmapImage image, int x, int y, int width, int height);
    public void DrawRectangle(int x, int y, int width, int height, Color color);
    public void DrawEllipse(int x, int y, int width, int height, Color color);
    
    // Output
    public BitmapImage ToImage();
    
    public void Dispose();
}
```

### PluginResources

Helper class for accessing embedded resources.

```csharp
public static class PluginResources
{
    public static void Init(Assembly assembly);
    public static string FindFile(string fileName);
    public static BitmapImage ReadImage(string resourceName);
    public static string ReadTextFile(string resourceName);
}
```

## Error Handling

### Common Exceptions

```csharp
// Plugin loading errors
public class PluginLoadException : Exception;

// Resource access errors  
public class ResourceNotFoundException : Exception;

// Device communication errors
public class DeviceException : Exception;
```

## Best Practices

### ✅ Do

- Always call base constructors with appropriate parameters
- Use `ActionImageChanged()` to notify of visual updates
- Implement proper error handling in `RunCommand()`
- Dispose resources in `Unload()`
- Use meaningful display names and descriptions

### ❌ Don't

- Block the UI thread in command methods
- Ignore exceptions without logging
- Create commands without proper grouping
- Forget to call state change notifications
- Hardcode file paths or settings

## Code Examples

### Complete Command Example

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
        try
        {
            // Toggle mute
            this.Plugin.ClientApplication.SendKeyboardShortcut(VirtualKeyCode.VolumeMute);
            
            // Update button appearance
            this.ActionImageChanged(actionParameter);
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Failed to toggle volume");
        }
    }

    protected override BitmapImage GetCommandImage(string actionParameter, PluginImageSize imageSize)
    {
        using var builder = new BitmapBuilder(imageSize);
        
        var isMuted = IsSystemMuted();
        var iconPath = isMuted ? "VolumeOff.png" : "VolumeOn.png";
        
        var iconImage = PluginResources.ReadImage(iconPath);
        builder.SetBackgroundImage(iconImage);
        
        return builder.ToImage();
    }
}
```

## Migration Guide

### From SDK v1.x to v2.x

Key changes in SDK v2.x:

1. **Constructor Changes**: All commands now require explicit display names
2. **New Image Sizes**: Support for additional image sizes
3. **Enhanced Logging**: Structured logging with log levels
4. **Async Support**: Better support for async operations

```csharp
// v1.x
public MyCommand() : base("My Command") { }

// v2.x  
public MyCommand() : base("My Command", "Description", "Group") { }
```

---

*This API reference covers the core SDK functionality. For advanced features and examples, see the [Guides & Tutorials](./guides/payment-intents.md).*