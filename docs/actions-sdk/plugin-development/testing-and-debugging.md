# Testing and Debugging the Plugin

Testing and debugging are crucial parts of plugin development. This guide covers various techniques to ensure your plugin works correctly and help you identify and fix issues.

## Testing Your Plugin

### 1. Local Testing

Before distributing your plugin, test it thoroughly in your development environment:

```csharp
public class TestPlugin : Plugin
{
    public override void Initialize()
    {
        // Add test commands
        AddCommand("TestCommand", "Test Command", () => {
            Console.WriteLine("Test command executed successfully!");
        });
        
        AddAdjustment("TestAdjustment", "Test Adjustment", (value) => {
            Console.WriteLine($"Adjustment value: {value}");
        });
    }
}
```

### 2. Unit Testing

Create unit tests for your plugin logic:

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MyPlugin;

[TestClass]
public class PluginTests
{
    [TestMethod]
    public void TestCommandExecution()
    {
        var plugin = new MyPlugin();
        // Test your plugin logic here
        Assert.IsTrue(true); // Replace with actual assertions
    }
}
```

### 3. Integration Testing

Test your plugin with the actual Logi Actions system:

1. **Install the plugin** in the development environment
2. **Assign commands** to device buttons
3. **Test all functionality** with real device interactions
4. **Verify error handling** by testing edge cases

## Debugging Techniques

### 1. Console Output

Use console output for basic debugging:

```csharp
public override void Initialize()
{
    Console.WriteLine("Plugin initialization started");
    
    try
    {
        AddCommand("DebugCommand", "Debug Command", () => {
            Console.WriteLine("Command executed at: " + DateTime.Now);
            // Your command logic here
        });
        
        Console.WriteLine("Plugin initialization completed successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error during initialization: " + ex.Message);
        throw;
    }
}
```

### 2. Logging

Implement proper logging for better debugging:

```csharp
using System.IO;

public class LoggingPlugin : Plugin
{
    private string logFile = "plugin.log";
    
    private void Log(string message)
    {
        string logEntry = $"{DateTime.Now}: {message}";
        File.AppendAllText(logFile, logEntry + Environment.NewLine);
    }
    
    public override void Initialize()
    {
        Log("Plugin initialization started");
        
        AddCommand("LoggingCommand", "Logging Command", () => {
            Log("Command executed");
            // Command logic
        });
        
        Log("Plugin initialization completed");
    }
}
```

### 3. Visual Studio Debugging

Use Visual Studio's debugging features:

1. **Set breakpoints** in your code
2. **Attach to process** (G HUB process)
3. **Use watch windows** to monitor variables
4. **Step through code** to identify issues

### 4. Remote Debugging

For debugging on different machines:

1. **Enable remote debugging** in Visual Studio
2. **Install Visual Studio Remote Debugger** on the target machine
3. **Attach to the remote process**

## Common Debugging Scenarios

### Plugin Not Loading

**Symptoms:**
* Plugin doesn't appear in G HUB
* No error messages visible

**Debugging Steps:**
1. Check the G HUB logs for errors
2. Verify the plugin DLL is in the correct location
3. Ensure the plugin class inherits from `Plugin`
4. Check for missing dependencies

**Example Debug Code:**
```csharp
public class DebugPlugin : Plugin
{
    public override void Initialize()
    {
        // Add extensive logging
        Console.WriteLine("=== Plugin Debug Info ===");
        Console.WriteLine($"Plugin Name: {GetName()}");
        Console.WriteLine($"Plugin Version: {GetVersion()}");
        Console.WriteLine($"Initialization Time: {DateTime.Now}");
        
        try
        {
            // Your initialization code
            Console.WriteLine("Initialization successful");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Initialization failed: {ex}");
            throw;
        }
    }
}
```

### Commands Not Executing

**Symptoms:**
* Commands are visible but don't execute
* No response when buttons are pressed

**Debugging Steps:**
1. Add logging to command callbacks
2. Check for exceptions in command execution
3. Verify command registration
4. Test with simple commands first

**Example Debug Code:**
```csharp
AddCommand("DebugCommand", "Debug Command", () => {
    Console.WriteLine("Command callback entered");
    
    try
    {
        // Your command logic
        Console.WriteLine("Command logic executed successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Command execution failed: {ex}");
        throw;
    }
});
```

### Performance Issues

**Symptoms:**
* Commands are slow to respond
* High CPU usage
* Memory leaks

**Debugging Steps:**
1. Profile your code for performance bottlenecks
2. Check for infinite loops or blocking operations
3. Monitor memory usage
4. Use async/await for long-running operations

**Example Performance Debug Code:**
```csharp
private Stopwatch stopwatch = new Stopwatch();

AddCommand("PerformanceCommand", "Performance Command", () => {
    stopwatch.Restart();
    
    // Your command logic here
    
    stopwatch.Stop();
    Console.WriteLine($"Command execution time: {stopwatch.ElapsedMilliseconds}ms");
});
```

## Debugging Tools

### 1. G HUB Logs

Check G HUB logs for plugin-related errors:

**Windows:**
```
%APPDATA%\LGHUB\logs\
```

**macOS:**
```
~/Library/Application Support/LGHUB/logs/
```

### 2. Plugin Logs

Create your own log files for detailed debugging:

```csharp
public class LoggingPlugin : Plugin
{
    private string logPath;
    
    public override void Initialize()
    {
        logPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Logitech", "Logi Actions", "Plugins", "myplugin.log"
        );
        
        Log("Plugin initialized");
    }
    
    private void Log(string message)
    {
        try
        {
            string logEntry = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} - {message}";
            File.AppendAllText(logPath, logEntry + Environment.NewLine);
        }
        catch
        {
            // Fallback to console if file logging fails
            Console.WriteLine($"LOG: {message}");
        }
    }
}
```

### 3. Visual Studio Diagnostic Tools

Use Visual Studio's diagnostic tools:

1. **Performance Profiler** - Identify performance bottlenecks
2. **Memory Profiler** - Detect memory leaks
3. **CPU Usage** - Monitor CPU usage during execution

## Best Practices

### 1. Defensive Programming

Always handle exceptions gracefully:

```csharp
public override void Initialize()
{
    try
    {
        // Your initialization code
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Plugin initialization failed: {ex.Message}");
        // Don't throw - let the plugin load with reduced functionality
    }
}
```

### 2. Progressive Testing

Test incrementally:

1. **Start with simple commands** that just log messages
2. **Add complexity gradually** as you verify each part works
3. **Test edge cases** and error conditions
4. **Test on different devices** if possible

### 3. Version Control

Use version control for your plugin code:

```csharp
public override string GetVersion()
{
    return "1.0.0"; // Update this as you make changes
}
```

## Next Steps

* [Distributing the Plugin](./distributing-plugin.md) - Learn how to package and distribute your plugin
* [Plugin Structure](../tutorial/plugin-structure.md) - Understand plugin architecture
* [API Reference](../api-reference.md) - Complete API documentation 