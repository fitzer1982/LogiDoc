# Link the Plugin to an Application

This tutorial shows you how to connect your Logi Actions plugin to external applications, allowing your plugin to interact with and control other software.

## Overview

Linking your plugin to applications enables powerful integrations where your Logi Actions device can control external software. This can include:

* **Photo editing applications** (Photoshop, Lightroom, etc.)
* **Video editing software** (Premiere Pro, DaVinci Resolve, etc.)
* **Audio applications** (Ableton Live, Pro Tools, etc.)
* **Development tools** (Visual Studio, VS Code, etc.)
* **Any application with automation capabilities**

## Basic Application Linking

### 1. Detect Running Applications

First, detect which applications are currently running:

```csharp
using System.Diagnostics;

public class MyPlugin : Plugin
{
    public override void Initialize()
    {
        AddCommand("ListApplications", "List Running Apps", () => {
            ListRunningApplications();
        });
    }
    
    private void ListRunningApplications()
    {
        Process[] processes = Process.GetProcesses();
        
        Console.WriteLine("=== Running Applications ===");
        foreach (Process process in processes)
        {
            if (!string.IsNullOrEmpty(process.MainWindowTitle))
            {
                Console.WriteLine($"{process.ProcessName}: {process.MainWindowTitle}");
            }
        }
    }
}
```

### 2. Check if Specific Application is Running

Check if a particular application is active:

```csharp
private bool IsApplicationRunning(string processName)
{
    Process[] processes = Process.GetProcessesByName(processName);
    return processes.Length > 0;
}

AddCommand("CheckPhotoshop", "Check if Photoshop is Running", () => {
    if (IsApplicationRunning("Photoshop"))
    {
        Console.WriteLine("✅ Photoshop is running");
    }
    else
    {
        Console.WriteLine("❌ Photoshop is not running");
    }
});
```

## Application-Specific Commands

### 1. Photoshop Integration

Create commands that work specifically with Photoshop:

```csharp
public override void Initialize()
{
    AddCommand("PhotoshopBrush", "Photoshop Brush Tool", () => {
        if (IsApplicationRunning("Photoshop"))
        {
            // Send keyboard shortcut to activate brush tool
            SendKeys.SendWait("b");
            Console.WriteLine("Brush tool activated in Photoshop");
        }
        else
        {
            Console.WriteLine("Photoshop is not running");
        }
    });
    
    AddCommand("PhotoshopEraser", "Photoshop Eraser Tool", () => {
        if (IsApplicationRunning("Photoshop"))
        {
            SendKeys.SendWait("e");
            Console.WriteLine("Eraser tool activated in Photoshop");
        }
    });
    
    AddAdjustment("PhotoshopOpacity", "Photoshop Opacity", (value) => {
        if (IsApplicationRunning("Photoshop"))
        {
            // Convert percentage to Photoshop opacity (0-100)
            int opacity = (int)value;
            
            // Send opacity value to Photoshop
            SendKeys.SendWait(opacity.ToString());
            Console.WriteLine($"Photoshop opacity: {opacity}%");
        }
    });
}
```

### 2. Lightroom Integration

Control Lightroom adjustments:

```csharp
AddAdjustment("LightroomExposure", "Lightroom Exposure", (value) => {
    if (IsApplicationRunning("Lightroom"))
    {
        // Convert percentage to exposure value (-5 to +5)
        double exposure = (value / 100.0) * 10.0 - 5.0;
        
        // Send exposure adjustment to Lightroom
        SendExposureToLightroom(exposure);
        Console.WriteLine($"Lightroom exposure: {exposure:F1}");
    }
});

AddAdjustment("LightroomContrast", "Lightroom Contrast", (value) => {
    if (IsApplicationRunning("Lightroom"))
    {
        // Convert percentage to contrast value (-100 to +100)
        int contrast = (int)(value * 2.0 - 100.0);
        
        SendContrastToLightroom(contrast);
        Console.WriteLine($"Lightroom contrast: {contrast}");
    }
});
```

## Advanced Application Integration

### 1. Using Windows API

For more advanced integration, use Windows API calls:

```csharp
using System.Runtime.InteropServices;

public class ApplicationController
{
    [DllImport("user32.dll")]
    private static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
    
    [DllImport("user32.dll")]
    private static extern bool SetForegroundWindow(IntPtr hWnd);
    
    [DllImport("user32.dll")]
    private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    
    public static bool ActivateApplication(string windowTitle)
    {
        IntPtr handle = FindWindow(null, windowTitle);
        if (handle != IntPtr.Zero)
        {
            ShowWindow(handle, 9); // SW_RESTORE
            SetForegroundWindow(handle);
            return true;
        }
        return false;
    }
}

// Use in your plugin
AddCommand("ActivatePhotoshop", "Activate Photoshop", () => {
    if (ApplicationController.ActivateApplication("Adobe Photoshop"))
    {
        Console.WriteLine("Photoshop activated");
    }
    else
    {
        Console.WriteLine("Photoshop not found");
    }
});
```

### 2. Application-Specific APIs

Some applications provide APIs for external control:

```csharp
// Example for applications with COM automation
public class ApplicationAutomation
{
    public static dynamic GetApplicationObject(string progId)
    {
        try
        {
            Type type = Type.GetTypeFromProgID(progId);
            return Activator.CreateInstance(type);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to create {progId} object: {ex.Message}");
            return null;
        }
    }
}

// Use with applications that support COM automation
AddCommand("ExcelNewSheet", "Excel New Sheet", () => {
    dynamic excel = ApplicationAutomation.GetApplicationObject("Excel.Application");
    if (excel != null)
    {
        excel.Workbooks.Add();
        Console.WriteLine("New Excel workbook created");
    }
});
```

## Application State Management

### 1. Track Application State

Maintain state information about linked applications:

```csharp
public class ApplicationState
{
    public string Name { get; set; }
    public bool IsRunning { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastChecked { get; set; }
}

public class MyPlugin : Plugin
{
    private Dictionary<string, ApplicationState> applicationStates = new Dictionary<string, ApplicationState>();
    
    public override void Initialize()
    {
        // Initialize application states
        applicationStates["Photoshop"] = new ApplicationState { Name = "Photoshop" };
        applicationStates["Lightroom"] = new ApplicationState { Name = "Lightroom" };
        
        // Set up periodic checking
        StartApplicationMonitoring();
    }
    
    private void StartApplicationMonitoring()
    {
        // Check application states every 5 seconds
        Timer timer = new Timer(CheckApplicationStates, null, 0, 5000);
    }
    
    private void CheckApplicationStates(object state)
    {
        foreach (var appState in applicationStates.Values)
        {
            bool wasRunning = appState.IsRunning;
            appState.IsRunning = IsApplicationRunning(appState.Name);
            appState.LastChecked = DateTime.Now;
            
            if (wasRunning != appState.IsRunning)
            {
                Console.WriteLine($"{appState.Name}: {(appState.IsRunning ? "Started" : "Stopped")}");
            }
        }
    }
}
```

### 2. Conditional Commands

Only enable commands when the target application is running:

```csharp
public override void Initialize()
{
    // Always available commands
    AddCommand("CheckApps", "Check Applications", () => {
        foreach (var appState in applicationStates.Values)
        {
            Console.WriteLine($"{appState.Name}: {(appState.IsRunning ? "Running" : "Stopped")}");
        }
    });
    
    // Photoshop-specific commands (only when running)
    if (applicationStates["Photoshop"].IsRunning)
    {
        AddCommand("PhotoshopSave", "Photoshop Save", () => {
            SendKeys.SendWait("^s");
            Console.WriteLine("Photoshop save command sent");
        });
    }
}
```

## Error Handling and Fallbacks

### 1. Graceful Degradation

Handle cases where applications are not available:

```csharp
AddCommand("SafeApplicationCommand", "Safe App Command", () => {
    try
    {
        if (IsApplicationRunning("TargetApp"))
        {
            // Execute application-specific command
            ExecuteAppCommand();
        }
        else
        {
            // Fallback behavior
            Console.WriteLine("Target application not running, using fallback");
            ExecuteFallbackCommand();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Application command failed: {ex.Message}");
        // Provide alternative functionality
    }
});
```

### 2. Application Launch

Launch applications if they're not running:

```csharp
AddCommand("LaunchPhotoshop", "Launch Photoshop", () => {
    if (IsApplicationRunning("Photoshop"))
    {
        Console.WriteLine("Photoshop is already running");
        return;
    }
    
    try
    {
        Process.Start("Photoshop.exe");
        Console.WriteLine("Photoshop launched");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to launch Photoshop: {ex.Message}");
    }
});
```

## Best Practices

### 1. Application Detection

* **Use process names** for reliable detection
* **Check window titles** for more specific identification
* **Handle multiple instances** of the same application
* **Cache application states** to avoid repeated checks

### 2. Command Design

* **Make commands context-aware** - only work when appropriate applications are running
* **Provide clear feedback** about application status
* **Include fallback behaviors** when applications are unavailable
* **Use descriptive names** that indicate which application the command affects

### 3. Performance

* **Avoid frequent application checks** - use caching and events
* **Use async operations** for long-running application interactions
* **Minimize resource usage** when applications are not running

## Next Steps

* [Change a Button Image](../tutorial/change-button-image.md) - Customize button appearances
* [Add a Command with a Parameter](../tutorial/add-command-with-parameter.md) - Create parameterized commands
* [Plugin Features](../plugin-features/manage-plugin-settings.md) - Advanced plugin features 