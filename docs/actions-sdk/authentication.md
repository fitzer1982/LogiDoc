# Authentication

Learn how to authenticate your plugin with the Logi Actions SDK and manage API keys securely.

## Authentication Methods

The Logi Actions SDK uses a simple API key-based authentication system for plugin registration and marketplace distribution.

### Development Authentication

During development, no authentication is required. Your plugin runs locally through the Logi Plugin Service.

### Marketplace Authentication

For marketplace distribution, you'll need:

1. **Developer API Key**: For plugin submission and management
2. **Plugin Signature**: For verified plugin distribution

## API Key Management

### Generate API Key

1. Log in to the [Developer Portal](https://developer.logitech.com)
2. Navigate to **Dashboard** → **API Keys**
3. Click **Generate New Key**
4. Copy and securely store your key

### API Key Types

| Key Type | Purpose | Scope |
|----------|---------|-------|
| **Development** | Testing and debugging | Local development only |
| **Production** | Live plugin distribution | Marketplace submission |

### Secure Storage

:::danger Never commit API keys to version control
Store API keys in environment variables or secure configuration files.
:::

#### Environment Variables

```bash
# Windows
set LOGI_API_KEY=your_api_key_here

# macOS/Linux  
export LOGI_API_KEY=your_api_key_here
```

#### Configuration File

Create a `config.json` file (add to `.gitignore`):

```json
{
  "apiKey": "your_api_key_here",
  "environment": "development"
}
```

## Plugin Authentication

### Plugin Manifest

Your plugin's authentication is configured in `metadata/LoupedeckPackage.yaml`:

```yaml
type: plugin4
name: MyPlugin
displayName: My Awesome Plugin
version: 1.0.0
author: YourName
# Authentication settings
apiVersion: "2.0"
permissions:
  - device_access
  - network_access
```

### Permission Scopes

| Permission | Description | Required For |
|------------|-------------|--------------|
| `device_access` | Access to device controls | All plugins |
| `network_access` | HTTP/HTTPS requests | API integrations |
| `file_system` | Local file operations | File management |
| `system_info` | System information | System monitoring |

## Code Examples

### Reading API Key

```csharp
public class MyPlugin : Plugin
{
    private string _apiKey;
    
    public override void Load()
    {
        // Read from environment variable
        _apiKey = Environment.GetEnvironmentVariable("LOGI_API_KEY");
        
        if (string.IsNullOrEmpty(_apiKey))
        {
            this.OnPluginStatusChanged(
                PluginStatus.Error, 
                "API key not configured", 
                "https://docs.example.com/setup"
            );
            return;
        }
        
        // Initialize plugin with API key
        InitializeWithApiKey(_apiKey);
    }
}
```

### Making Authenticated Requests

```csharp
private async Task<string> MakeApiRequest(string endpoint)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Add("X-API-Key", _apiKey);
    
    var response = await client.GetAsync($"https://api.example.com/{endpoint}");
    return await response.Content.ReadAsStringAsync();
}
```

## Security Best Practices

### ✅ Do

- Store API keys in environment variables
- Use HTTPS for all API requests
- Validate API responses
- Handle authentication errors gracefully
- Rotate API keys regularly

### ❌ Don't

- Hardcode API keys in source code
- Commit keys to version control
- Share keys between environments
- Log API keys in plain text
- Use development keys in production

## Error Handling

### Common Authentication Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `401` | Invalid API key | Check key format and permissions |
| `403` | Insufficient permissions | Request additional scopes |
| `429` | Rate limit exceeded | Implement retry logic |
| `500` | Server error | Check service status |

### Error Handling Example

```csharp
try
{
    var result = await MakeApiRequest("endpoint");
}
catch (HttpRequestException ex) when (ex.Message.Contains("401"))
{
    this.OnPluginStatusChanged(
        PluginStatus.Error,
        "Invalid API key",
        "https://docs.example.com/auth"
    );
}
catch (HttpRequestException ex) when (ex.Message.Contains("429"))
{
    // Implement exponential backoff
    await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, retryCount)));
}
```

## Testing Authentication

### Local Testing

```bash
# Set test API key
set LOGI_API_KEY=test_key_12345

# Build and run plugin
dotnet build
dotnet run
```

### Validation Script

```csharp
public static bool ValidateApiKey(string apiKey)
{
    if (string.IsNullOrWhiteSpace(apiKey))
        return false;
        
    if (apiKey.Length < 32)
        return false;
        
    // Additional validation logic
    return true;
}
```

## Next Steps

✅ **Authentication configured?** → Continue to [Quick Start](./quick-start.md)  
📚 **Need more details?** → Read [Core Concepts](./core-concepts/objects.md)  
❓ **Having issues?** → Check [FAQ](./faq.md)

---

*Estimated setup time: 5 minutes*