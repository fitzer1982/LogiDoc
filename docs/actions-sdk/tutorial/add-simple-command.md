# Add a Simple Command

Commands are the core functionality of Logi Actions plugins. This tutorial shows you how to add simple commands to your plugin.

## What is a Command?

A command is an action that gets executed when a user presses a button on their device (MX Creative Console, Loupedeck CT, Live, or Live S). Commands can perform any action you want, from simple tasks like opening applications to complex workflows.

## Basic Command Structure

The basic structure for adding a command is:

```csharp
AddCommand("CommandId", "Display Name", () => {
    // Command logic here
});
```

### Parameters

* **CommandId** - A unique identifier for the command (used internally)
* **Display Name** - The name shown to users in the G HUB interface
* **Action** - A lambda expression containing the code to execute

## Your First Command

Let's start with a simple command that displays a message:

```csharp
using LogiActionsSDK;
using System;

namespace MyFirstPlugin
{
    public class MyPlugin : Plugin
    {
        public override string GetName() => "My First Plugin";
        public override string GetVersion() => "1.0.0";

        public override void Initialize()
        {
            // Add a simple command
            AddCommand("HelloWorld", "Say Hello", () => {
                Console.WriteLine("Hello from my plugin!");
            });
        }
    }
}
```

## Common Command Examples

### 1. Open an Application

```csharp
AddCommand("OpenNotepad", "Open Notepad", () => {
    System.Diagnostics.Process.Start("notepad.exe");
});
```

### 2. Simulate Keyboard Shortcuts

```csharp
AddCommand("Copy", "Copy", () => {
    // Simulate Ctrl+C
    System.Windows.Forms.SendKeys.SendWait("^c");
});
```

### 3. System Operations

```csharp
AddCommand("MuteAudio", "Mute Audio", () => {
    // Mute system audio
    var volume = new System.Management.ManagementObjectSearcher("SELECT * FROM Win32_SoundDevice");
    // Implementation depends on your audio library
});
```

### 4. File Operations

```csharp
AddCommand("CreateBackup", "Create Backup", () => {
    string sourceDir = @"C:\MyProject";
    string backupDir = @"C:\Backups\MyProject_" + DateTime.Now.ToString("yyyyMMdd_HHmmss");
    
    if (System.IO.Directory.Exists(sourceDir))
    {
        System.IO.Directory.CreateDirectory(backupDir);
        CopyDirectory(sourceDir, backupDir);
        Console.WriteLine($"Backup created: {backupDir}");
    }
});

private void CopyDirectory(string source, string destination)
{
    // Implementation of directory copying
}
```

## Command with Parameters

You can create commands that accept parameters:

```csharp
AddCommand("OpenWebsite", "Open Website", () => {
    string url = "https://www.google.com";
    System.Diagnostics.Process.Start(url);
});

// Or with configurable parameters
AddCommand("OpenCustomWebsite", "Open Custom Website", () => {
    string url = GetConfigurationValue("DefaultWebsite");
    if (!string.IsNullOrEmpty(url))
    {
        System.Diagnostics.Process.Start(url);
    }
});
```

## Error Handling in Commands

Always handle errors gracefully in your commands:

```csharp
AddCommand("SafeOperation", "Safe Operation", () => {
    try
    {
        // Your command logic here
        Console.WriteLine("Command executed successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Command failed: {ex.Message}");
        // Don't throw - handle the error gracefully
    }
});
```

## Async Commands

For long-running operations, use async commands:

```csharp
AddCommand("AsyncOperation", "Async Operation", async () => {
    try
    {
        Console.WriteLine("Starting async operation...");
        
        // Simulate a long-running task
        await Task.Delay(2000);
        
        Console.WriteLine("Async operation completed!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Async operation failed: {ex.Message}");
    }
});
```

## Command Categories

Organize your commands into logical categories:

```csharp
public override void Initialize()
{
    RegisterSystemCommands();
    RegisterFileCommands();
    RegisterNetworkCommands();
}

private void RegisterSystemCommands()
{
    AddCommand("SystemInfo", "System Info", () => {
        Console.WriteLine($"OS: {Environment.OSVersion}");
        Console.WriteLine($"Machine: {Environment.MachineName}");
    });
    
    AddCommand("Restart", "Restart Computer", () => {
        // Implementation for restart
    });
}

private void RegisterFileCommands()
{
    AddCommand("CreateFolder", "Create Folder", () => {
        string folderPath = @"C:\NewFolder";
        if (!System.IO.Directory.Exists(folderPath))
        {
            System.IO.Directory.CreateDirectory(folderPath);
            Console.WriteLine($"Folder created: {folderPath}");
        }
    });
}

private void RegisterNetworkCommands()
{
    AddCommand("PingGoogle", "Ping Google", () => {
        // Implementation for network ping
    });
}
```

## Command State Management

Some commands might need to maintain state:

```csharp
public class MyPlugin : Plugin
{
    private bool isFeatureEnabled = false;
    
    public override void Initialize()
    {
        AddCommand("ToggleFeature", "Toggle Feature", () => {
            isFeatureEnabled = !isFeatureEnabled;
            Console.WriteLine($"Feature is now {(isFeatureEnabled ? "enabled" : "disabled")}");
        });
        
        AddCommand("CheckFeature", "Check Feature Status", () => {
            Console.WriteLine($"Feature is {(isFeatureEnabled ? "enabled" : "disabled")}");
        });
    }
}
```

## Command with User Input

You can create commands that interact with the user:

```csharp
AddCommand("GetUserInput", "Get User Input", () => {
    Console.WriteLine("Please enter your name:");
    string name = Console.ReadLine();
    
    if (!string.IsNullOrEmpty(name))
    {
        Console.WriteLine($"Hello, {name}!");
    }
    else
    {
        Console.WriteLine("No name provided.");
    }
});
```

## Best Practices

### 1. Descriptive Names

Use clear, descriptive names for your commands:

```csharp
// Good
AddCommand("OpenVisualStudio", "Open Visual Studio", () => { /* ... */ });

// Bad
AddCommand("vs", "VS", () => { /* ... */ });
```

### 2. Error Handling

Always handle potential errors:

```csharp
AddCommand("SafeFileOperation", "Safe File Operation", () => {
    try
    {
        // File operation
    }
    catch (UnauthorizedAccessException)
    {
        Console.WriteLine("Access denied. Check permissions.");
    }
    catch (FileNotFoundException)
    {
        Console.WriteLine("File not found.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Unexpected error: {ex.Message}");
    }
});
```

### 3. Logging

Add logging to help with debugging:

```csharp
AddCommand("LoggedCommand", "Logged Command", () => {
    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Command executed");
    
    // Command logic
    
    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] Command completed");
});
```

### 4. Performance

Keep commands fast and responsive:

```csharp
AddCommand("FastCommand", "Fast Command", () => {
    // Quick operation
    Console.WriteLine("Done!");
});

// For slow operations, use async
AddCommand("SlowCommand", "Slow Command", async () => {
    Console.WriteLine("Starting slow operation...");
    await Task.Delay(5000); // Simulate slow work
    Console.WriteLine("Slow operation completed!");
});
```

## Testing Your Commands

Test your commands thoroughly:

```csharp
public override void Initialize()
{
    // Test command
    AddCommand("TestCommand", "Test Command", () => {
        Console.WriteLine("=== Command Test ===");
        Console.WriteLine($"Time: {DateTime.Now}");
        Console.WriteLine($"Plugin: {GetName()}");
        Console.WriteLine($"Version: {GetVersion()}");
        Console.WriteLine("Test completed successfully!");
    });
}
```

## Next Steps

* [Add a Simple Adjustment](../tutorial/add-simple-adjustment.md) - Learn how to add adjustments to your plugin
* [Link the Plugin to an Application](../tutorial/link-plugin-to-application.md) - Connect your plugin to external applications
* [Plugin Features](../plugin-features/manage-plugin-settings.md) - Advanced plugin features 