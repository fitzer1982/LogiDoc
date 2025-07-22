# Manage Plugin Settings

Plugin settings allow you to configure your plugin's behavior and store user preferences. This guide shows you how to implement settings management in your Logi Actions plugin.

## Basic Settings Management

### 1. Simple Settings

Start with basic settings using a simple configuration class:

```csharp
public class PluginSettings
{
    public bool EnableFeature1 { get; set; } = true;
    public string DefaultWebsite { get; set; } = "https://www.google.com";
    public int MaxRetries { get; set; } = 3;
    public string LogLevel { get; set; } = "Info";
}
```

### 2. Loading Settings

Load settings when your plugin initializes:

```csharp
public class MyPlugin : Plugin
{
    private PluginSettings settings;
    
    public override void Initialize()
    {
        LoadSettings();
        RegisterCommands();
    }
    
    private void LoadSettings()
    {
        try
        {
            string settingsPath = GetSettingsFilePath();
            if (File.Exists(settingsPath))
            {
                string json = File.ReadAllText(settingsPath);
                settings = JsonConvert.DeserializeObject<PluginSettings>(json);
            }
            else
            {
                settings = new PluginSettings(); // Use defaults
                SaveSettings();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to load settings: {ex.Message}");
            settings = new PluginSettings(); // Use defaults
        }
    }
    
    private string GetSettingsFilePath()
    {
        string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        return Path.Combine(appData, "Logitech", "Logi Actions", "Plugins", "MyPlugin", "settings.json");
    }
}
```

### 3. Saving Settings

Save settings when they change:

```csharp
private void SaveSettings()
{
    try
    {
        string settingsPath = GetSettingsFilePath();
        string directory = Path.GetDirectoryName(settingsPath);
        
        if (!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }
        
        string json = JsonConvert.SerializeObject(settings, Formatting.Indented);
        File.WriteAllText(settingsPath, json);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to save settings: {ex.Message}");
    }
}
```

## Using Settings in Commands

### 1. Commands with Settings

Use settings to configure command behavior:

```csharp
private void RegisterCommands()
{
    AddCommand("OpenWebsite", "Open Website", () => {
        if (!string.IsNullOrEmpty(settings.DefaultWebsite))
        {
            System.Diagnostics.Process.Start(settings.DefaultWebsite);
        }
        else
        {
            Console.WriteLine("No default website configured");
        }
    });
    
    AddCommand("ToggleFeature", "Toggle Feature 1", () => {
        settings.EnableFeature1 = !settings.EnableFeature1;
        SaveSettings();
        Console.WriteLine($"Feature 1 is now {(settings.EnableFeature1 ? "enabled" : "disabled")}");
    });
    
    AddCommand("SetWebsite", "Set Default Website", () => {
        Console.WriteLine("Enter new default website:");
        string newWebsite = Console.ReadLine();
        
        if (!string.IsNullOrEmpty(newWebsite))
        {
            settings.DefaultWebsite = newWebsite;
            SaveSettings();
            Console.WriteLine($"Default website set to: {newWebsite}");
        }
    });
}
```

### 2. Conditional Commands

Register commands based on settings:

```csharp
private void RegisterCommands()
{
    // Always register these commands
    AddCommand("ShowSettings", "Show Settings", () => {
        ShowCurrentSettings();
    });
    
    // Register feature-specific commands only if enabled
    if (settings.EnableFeature1)
    {
        AddCommand("Feature1Action", "Feature 1 Action", () => {
            // Feature 1 specific logic
        });
    }
    
    // Register commands based on log level
    if (settings.LogLevel == "Debug")
    {
        AddCommand("DebugInfo", "Show Debug Info", () => {
            ShowDebugInformation();
        });
    }
}
```

## Advanced Settings Management

### 1. Settings with Validation

Add validation to your settings:

```csharp
public class PluginSettings
{
    private int maxRetries = 3;
    private string logLevel = "Info";
    
    public bool EnableFeature1 { get; set; } = true;
    public string DefaultWebsite { get; set; } = "https://www.google.com";
    
    public int MaxRetries
    {
        get => maxRetries;
        set => maxRetries = Math.Max(1, Math.Min(10, value)); // Clamp between 1 and 10
    }
    
    public string LogLevel
    {
        get => logLevel;
        set => logLevel = ValidateLogLevel(value);
    }
    
    private string ValidateLogLevel(string level)
    {
        string[] validLevels = { "Debug", "Info", "Warning", "Error" };
        return validLevels.Contains(level) ? level : "Info";
    }
}
```

### 2. Settings with Events

Notify when settings change:

```csharp
public class PluginSettings
{
    public event EventHandler SettingsChanged;
    
    private bool enableFeature1 = true;
    
    public bool EnableFeature1
    {
        get => enableFeature1;
        set
        {
            if (enableFeature1 != value)
            {
                enableFeature1 = value;
                SettingsChanged?.Invoke(this, EventArgs.Empty);
            }
        }
    }
}

// In your plugin
public class MyPlugin : Plugin
{
    public override void Initialize()
    {
        LoadSettings();
        settings.SettingsChanged += OnSettingsChanged;
        RegisterCommands();
    }
    
    private void OnSettingsChanged(object sender, EventArgs e)
    {
        Console.WriteLine("Settings changed, updating plugin behavior...");
        // Update plugin behavior based on new settings
        UpdatePluginBehavior();
    }
}
```

### 3. Settings with Categories

Organize settings into categories:

```csharp
public class PluginSettings
{
    public GeneralSettings General { get; set; } = new GeneralSettings();
    public FeatureSettings Features { get; set; } = new FeatureSettings();
    public LoggingSettings Logging { get; set; } = new LoggingSettings();
}

public class GeneralSettings
{
    public string DefaultWebsite { get; set; } = "https://www.google.com";
    public int MaxRetries { get; set; } = 3;
}

public class FeatureSettings
{
    public bool EnableFeature1 { get; set; } = true;
    public bool EnableFeature2 { get; set; } = false;
}

public class LoggingSettings
{
    public string LogLevel { get; set; } = "Info";
    public bool EnableFileLogging { get; set; } = false;
    public string LogFilePath { get; set; } = "plugin.log";
}
```

## Settings UI Commands

### 1. Settings Display Commands

Create commands to show and modify settings:

```csharp
private void RegisterSettingsCommands()
{
    AddCommand("ShowSettings", "Show Settings", () => {
        ShowCurrentSettings();
    });
    
    AddCommand("ResetSettings", "Reset to Defaults", () => {
        settings = new PluginSettings();
        SaveSettings();
        Console.WriteLine("Settings reset to defaults");
    });
    
    AddCommand("EditSettings", "Edit Settings", () => {
        EditSettingsInteractively();
    });
}

private void ShowCurrentSettings()
{
    Console.WriteLine("=== Current Settings ===");
    Console.WriteLine($"Enable Feature 1: {settings.EnableFeature1}");
    Console.WriteLine($"Default Website: {settings.DefaultWebsite}");
    Console.WriteLine($"Max Retries: {settings.MaxRetries}");
    Console.WriteLine($"Log Level: {settings.LogLevel}");
    Console.WriteLine("========================");
}

private void EditSettingsInteractively()
{
    Console.WriteLine("=== Edit Settings ===");
    
    Console.WriteLine($"Current default website: {settings.DefaultWebsite}");
    Console.WriteLine("Enter new default website (or press Enter to keep current):");
    string newWebsite = Console.ReadLine();
    
    if (!string.IsNullOrEmpty(newWebsite))
    {
        settings.DefaultWebsite = newWebsite;
    }
    
    Console.WriteLine($"Current log level: {settings.LogLevel}");
    Console.WriteLine("Enter new log level (Debug/Info/Warning/Error) or press Enter to keep current:");
    string newLogLevel = Console.ReadLine();
    
    if (!string.IsNullOrEmpty(newLogLevel))
    {
        settings.LogLevel = newLogLevel;
    }
    
    SaveSettings();
    Console.WriteLine("Settings updated successfully!");
}
```

### 2. Settings Validation Commands

Add commands to validate settings:

```csharp
AddCommand("ValidateSettings", "Validate Settings", () => {
    var errors = ValidateSettings();
    
    if (errors.Count == 0)
    {
        Console.WriteLine("All settings are valid!");
    }
    else
    {
        Console.WriteLine("Settings validation errors:");
        foreach (var error in errors)
        {
            Console.WriteLine($"- {error}");
        }
    }
});

private List<string> ValidateSettings()
{
    var errors = new List<string>();
    
    if (string.IsNullOrEmpty(settings.DefaultWebsite))
    {
        errors.Add("Default website cannot be empty");
    }
    
    if (!Uri.IsWellFormedUriString(settings.DefaultWebsite, UriKind.Absolute))
    {
        errors.Add("Default website must be a valid URL");
    }
    
    if (settings.MaxRetries < 1 || settings.MaxRetries > 10)
    {
        errors.Add("Max retries must be between 1 and 10");
    }
    
    return errors;
}
```

## Settings Migration

### 1. Version Management

Handle settings version changes:

```csharp
public class PluginSettings
{
    public int Version { get; set; } = 1;
    public bool EnableFeature1 { get; set; } = true;
    public string DefaultWebsite { get; set; } = "https://www.google.com";
}

private void LoadSettings()
{
    try
    {
        string settingsPath = GetSettingsFilePath();
        if (File.Exists(settingsPath))
        {
            string json = File.ReadAllText(settingsPath);
            settings = JsonConvert.DeserializeObject<PluginSettings>(json);
            
            // Migrate settings if needed
            MigrateSettingsIfNeeded();
        }
        else
        {
            settings = new PluginSettings();
            SaveSettings();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to load settings: {ex.Message}");
        settings = new PluginSettings();
    }
}

private void MigrateSettingsIfNeeded()
{
    if (settings.Version < 2)
    {
        // Add new settings for version 2
        // settings.NewSetting = defaultValue;
        settings.Version = 2;
        SaveSettings();
        Console.WriteLine("Settings migrated to version 2");
    }
}
```

## Best Practices

### 1. Default Values

Always provide sensible defaults:

```csharp
public class PluginSettings
{
    // Good: Provide defaults
    public bool EnableFeature1 { get; set; } = true;
    public string DefaultWebsite { get; set; } = "https://www.google.com";
    
    // Bad: No defaults
    public bool EnableFeature1 { get; set; }
    public string DefaultWebsite { get; set; }
}
```

### 2. Error Handling

Handle settings errors gracefully:

```csharp
private void LoadSettings()
{
    try
    {
        // Load settings
    }
    catch (JsonException ex)
    {
        Console.WriteLine($"Settings file is corrupted: {ex.Message}");
        settings = new PluginSettings();
        SaveSettings(); // Create new settings file
    }
    catch (UnauthorizedAccessException ex)
    {
        Console.WriteLine($"Cannot access settings file: {ex.Message}");
        settings = new PluginSettings();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Unexpected error loading settings: {ex.Message}");
        settings = new PluginSettings();
    }
}
```

### 3. Settings Documentation

Document your settings:

```csharp
public class PluginSettings
{
    /// <summary>
    /// Enables or disables Feature 1 functionality
    /// </summary>
    public bool EnableFeature1 { get; set; } = true;
    
    /// <summary>
    /// The default website to open when using the Open Website command
    /// Must be a valid URL
    /// </summary>
    public string DefaultWebsite { get; set; } = "https://www.google.com";
    
    /// <summary>
    /// Maximum number of retry attempts for failed operations
    /// Valid range: 1-10
    /// </summary>
    public int MaxRetries { get; set; } = 3;
}
```

## Next Steps

* [Dynamic Folders](./dynamic-folders.md) - Create dynamic folder structures
* [Profile Actions](./profile-actions.md) - Manage profile-specific actions
* [Plugin Localization](./plugin-localization.md) - Support multiple languages 