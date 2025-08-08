# Building Plugin Commands

Learn how to create effective plugin commands that respond to user interactions and integrate with external services.

## Overview

Plugin commands are the primary way users interact with your plugin. This guide covers best practices for creating responsive, reliable commands.

## Basic Command Structure

### Simple Command

```csharp
public class BasicCommand : PluginDynamicCommand
{
    public BasicCommand() : base(
        displayName: "My Action",
        description: "What this action does",
        groupName: "My Plugin")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        // Your command logic here
        ExecuteAction();
    }

    private void ExecuteAction()
    {
        // Implementation
        Console.WriteLine("Action executed!");
    }
}
```

### Command with Visual Feedback

```csharp
public class StatusCommand : PluginDynamicCommand
{
    private bool _isActive = false;

    public StatusCommand() : base("Toggle Status", "Toggle active status", "Demo")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        _isActive = !_isActive;
        
        // Update button appearance
        this.ActionImageChanged(actionParameter);
        
        // Log the change
        this.Plugin.Log.Info($"Status changed to: {_isActive}");
    }

    protected override string GetCommandDisplayName(string actionParameter, PluginImageSize imageSize)
    {
        return _isActive ? "Active" : "Inactive";
    }

    protected override BitmapImage GetCommandImage(string actionParameter, PluginImageSize imageSize)
    {
        using var builder = new BitmapBuilder(imageSize);
        
        var color = _isActive ? Color.Green : Color.Red;
        builder.Clear(Color.Black);
        builder.DrawEllipse(10, 10, 60, 60, color);
        
        return builder.ToImage();
    }
}
```

## Advanced Command Patterns

### Async Command Execution

```csharp
public class AsyncCommand : PluginDynamicCommand
{
    private readonly HttpClient _httpClient = new();

    public AsyncCommand() : base("Fetch Data", "Get data from API", "Network")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        // Don't block the UI thread
        _ = Task.Run(async () => await ExecuteAsync(actionParameter));
    }

    private async Task ExecuteAsync(string actionParameter)
    {
        try
        {
            var response = await _httpClient.GetStringAsync("https://api.example.com/data");
            
            // Update UI on main thread
            await Task.Run(() => UpdateDisplay(response));
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Failed to fetch data");
            ShowError("Network error");
        }
    }

    private void UpdateDisplay(string data)
    {
        // Update button or device display
        this.ActionImageChanged();
    }

    private void ShowError(string message)
    {
        // Show error state
        this.ActionImageChanged();
    }
}
```

### Parameterized Commands

```csharp
public class MultiOptionCommand : PluginDynamicCommand
{
    public MultiOptionCommand() : base()
    {
        // Add multiple parameter options
        this.AddParameter("option1", "First Option", "Options");
        this.AddParameter("option2", "Second Option", "Options");
        this.AddParameter("option3", "Third Option", "Options");
    }

    protected override void RunCommand(string actionParameter)
    {
        switch (actionParameter)
        {
            case "option1":
                ExecuteOption1();
                break;
            case "option2":
                ExecuteOption2();
                break;
            case "option3":
                ExecuteOption3();
                break;
            default:
                this.Plugin.Log.Warning($"Unknown parameter: {actionParameter}");
                break;
        }
    }

    protected override string GetCommandDisplayName(string actionParameter, PluginImageSize imageSize)
    {
        return actionParameter switch
        {
            "option1" => "Option 1",
            "option2" => "Option 2", 
            "option3" => "Option 3",
            _ => "Unknown"
        };
    }

    private void ExecuteOption1() { /* Implementation */ }
    private void ExecuteOption2() { /* Implementation */ }
    private void ExecuteOption3() { /* Implementation */ }
}
```

## Integration Patterns

### API Integration

```csharp
public class ApiIntegrationCommand : PluginDynamicCommand
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public ApiIntegrationCommand() : base("API Action", "Trigger API call", "Integration")
    {
        _httpClient = new HttpClient();
        _apiKey = Environment.GetEnvironmentVariable("API_KEY");
        
        if (string.IsNullOrEmpty(_apiKey))
        {
            this.Plugin.OnPluginStatusChanged(
                PluginStatus.Error,
                "API key not configured",
                "https://docs.example.com/setup"
            );
        }
    }

    protected override void RunCommand(string actionParameter)
    {
        if (string.IsNullOrEmpty(_apiKey))
        {
            ShowConfigurationError();
            return;
        }

        _ = Task.Run(async () => await CallApiAsync());
    }

    private async Task CallApiAsync()
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");

            var payload = new
            {
                action = "trigger",
                timestamp = DateTime.UtcNow
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.example.com/trigger", content);
            
            if (response.IsSuccessStatusCode)
            {
                ShowSuccess();
            }
            else
            {
                ShowError($"API error: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "API call failed");
            ShowError("Network error");
        }
    }

    private void ShowSuccess()
    {
        // Update button to show success state
        this.ActionImageChanged();
    }

    private void ShowError(string message)
    {
        // Update button to show error state
        this.ActionImageChanged();
    }

    private void ShowConfigurationError()
    {
        // Show configuration needed state
        this.ActionImageChanged();
    }
}
```

### File System Integration

```csharp
public class FileCommand : PluginDynamicCommand
{
    public FileCommand() : base("Process File", "Process selected file", "Files")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        var openFileDialog = new OpenFileDialog
        {
            Filter = "Text files (*.txt)|*.txt|All files (*.*)|*.*",
            Title = "Select file to process"
        };

        if (openFileDialog.ShowDialog() == DialogResult.OK)
        {
            _ = Task.Run(() => ProcessFile(openFileDialog.FileName));
        }
    }

    private void ProcessFile(string filePath)
    {
        try
        {
            var content = File.ReadAllText(filePath);
            var wordCount = content.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
            
            this.Plugin.Log.Info($"Processed file: {Path.GetFileName(filePath)}, Words: {wordCount}");
            
            // Update display with result
            UpdateDisplayWithResult(wordCount);
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, $"Failed to process file: {filePath}");
            ShowError();
        }
    }

    private void UpdateDisplayWithResult(int wordCount)
    {
        // Store result for display
        this.Plugin.SetPluginSetting("last_word_count", wordCount.ToString(), false);
        this.ActionImageChanged();
    }

    protected override string GetCommandDisplayName(string actionParameter, PluginImageSize imageSize)
    {
        if (this.Plugin.TryGetPluginSetting("last_word_count", out var countStr) &&
            int.TryParse(countStr, out var count))
        {
            return $"Words: {count}";
        }
        
        return "Process File";
    }

    private void ShowError()
    {
        this.ActionImageChanged();
    }
}
```

## Error Handling Best Practices

### Robust Error Handling

```csharp
public class RobustCommand : PluginDynamicCommand
{
    public RobustCommand() : base("Robust Action", "Action with error handling", "Demo")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        try
        {
            ExecuteMainLogic();
        }
        catch (ArgumentException ex)
        {
            this.Plugin.Log.Warning(ex, "Invalid argument provided");
            ShowUserError("Invalid input");
        }
        catch (UnauthorizedAccessException ex)
        {
            this.Plugin.Log.Error(ex, "Access denied");
            ShowUserError("Permission denied");
        }
        catch (HttpRequestException ex)
        {
            this.Plugin.Log.Error(ex, "Network request failed");
            ShowUserError("Network error");
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Unexpected error in command execution");
            ShowUserError("Unexpected error");
        }
    }

    private void ExecuteMainLogic()
    {
        // Main command logic that might throw exceptions
        throw new NotImplementedException("Demo exception");
    }

    private void ShowUserError(string message)
    {
        // Update button to show error state
        // Could also show a notification or update device display
        this.ActionImageChanged();
    }
}
```

### Retry Logic

```csharp
public class RetryCommand : PluginDynamicCommand
{
    private const int MaxRetries = 3;
    private readonly TimeSpan RetryDelay = TimeSpan.FromSeconds(1);

    public RetryCommand() : base("Retry Action", "Action with retry logic", "Demo")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        _ = Task.Run(async () => await ExecuteWithRetry());
    }

    private async Task ExecuteWithRetry()
    {
        for (int attempt = 1; attempt <= MaxRetries; attempt++)
        {
            try
            {
                await ExecuteOperation();
                ShowSuccess();
                return; // Success, exit retry loop
            }
            catch (Exception ex) when (attempt < MaxRetries)
            {
                this.Plugin.Log.Warning(ex, $"Attempt {attempt} failed, retrying...");
                await Task.Delay(RetryDelay);
            }
            catch (Exception ex)
            {
                this.Plugin.Log.Error(ex, $"All {MaxRetries} attempts failed");
                ShowError();
                return;
            }
        }
    }

    private async Task ExecuteOperation()
    {
        // Simulate operation that might fail
        await Task.Delay(100);
        
        if (Random.Shared.NextDouble() < 0.7) // 70% chance of failure for demo
        {
            throw new InvalidOperationException("Simulated failure");
        }
    }

    private void ShowSuccess()
    {
        this.ActionImageChanged();
    }

    private void ShowError()
    {
        this.ActionImageChanged();
    }
}
```

## Performance Optimization

### Caching Results

```csharp
public class CachedCommand : PluginDynamicCommand
{
    private readonly Dictionary<string, CacheItem> _cache = new();
    private readonly TimeSpan _cacheExpiry = TimeSpan.FromMinutes(5);

    public CachedCommand() : base("Cached Action", "Action with caching", "Performance")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        _ = Task.Run(async () => await ExecuteWithCache(actionParameter));
    }

    private async Task ExecuteWithCache(string key)
    {
        // Check cache first
        if (_cache.TryGetValue(key, out var cached) && 
            DateTime.UtcNow - cached.Timestamp < _cacheExpiry)
        {
            DisplayResult(cached.Data);
            return;
        }

        try
        {
            // Fetch fresh data
            var data = await FetchData(key);
            
            // Update cache
            _cache[key] = new CacheItem
            {
                Data = data,
                Timestamp = DateTime.UtcNow
            };

            DisplayResult(data);
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Failed to fetch data");
            
            // Use stale cache if available
            if (_cache.TryGetValue(key, out var stale))
            {
                this.Plugin.Log.Info("Using stale cached data");
                DisplayResult(stale.Data);
            }
            else
            {
                ShowError();
            }
        }
    }

    private async Task<string> FetchData(string key)
    {
        // Simulate API call
        await Task.Delay(1000);
        return $"Data for {key} at {DateTime.Now:HH:mm:ss}";
    }

    private void DisplayResult(string data)
    {
        this.Plugin.Log.Info($"Displaying: {data}");
        this.ActionImageChanged();
    }

    private void ShowError()
    {
        this.ActionImageChanged();
    }

    private class CacheItem
    {
        public string Data { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
```

## Testing Commands

### Unit Testing

```csharp
[TestClass]
public class CommandTests
{
    [TestMethod]
    public void BasicCommand_Execute_CompletesSuccessfully()
    {
        // Arrange
        var command = new BasicCommand();
        var executed = false;
        
        // Act
        command.RunCommand("");
        
        // Assert
        Assert.IsTrue(executed);
    }

    [TestMethod]
    public async Task AsyncCommand_Execute_HandlesErrors()
    {
        // Arrange
        var command = new AsyncCommand();
        
        // Act & Assert
        Assert.DoesNotThrow(() => command.RunCommand(""));
        
        // Wait for async completion
        await Task.Delay(100);
    }
}
```

## Next Steps

- **Learn about adjustments**: [Save Cards](./save-cards.md)
- **Implement webhooks**: [Webhooks Guide](./webhooks-guide.md)
- **Explore samples**: [Sample Projects](../samples.md)

---

*Building effective commands is key to creating engaging plugin experiences.*