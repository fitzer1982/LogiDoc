# Sample Projects

Explore real-world examples and sample plugins to accelerate your development.

:::info Interactive Playground
Try our [online playground](https://playground.logitech.dev) to experiment with plugin concepts without installing anything.
:::

## Featured Samples

### 🎵 Spotify Controller
Complete plugin for controlling Spotify playback with custom artwork display.

**Features:**
- Play/pause/skip controls
- Volume adjustment
- Album artwork on touch buttons
- Now playing information

**[View Source](https://github.com/logitech/actions-sdk-samples/tree/main/SpotifyController)** | **[Download .lplug4](https://github.com/logitech/actions-sdk-samples/releases/latest/download/SpotifyController.lplug4)**

### 🌦️ Weather Dashboard
Real-time weather information with beautiful visual displays.

**Features:**
- Current conditions display
- 5-day forecast
- Weather alerts
- Location-based updates

**[View Source](https://github.com/logitech/actions-sdk-samples/tree/main/WeatherDashboard)** | **[Download .lplug4](https://github.com/logitech/actions-sdk-samples/releases/latest/download/WeatherDashboard.lplug4)**

### 🔧 System Monitor
Monitor system performance with real-time metrics.

**Features:**
- CPU and memory usage
- Network activity
- Temperature monitoring
- Custom alerts

**[View Source](https://github.com/logitech/actions-sdk-samples/tree/main/SystemMonitor)** | **[Download .lplug4](https://github.com/logitech/actions-sdk-samples/releases/latest/download/SystemMonitor.lplug4)**

## Code Snippets

### Basic Command Template

```csharp
public class TemplateCommand : PluginDynamicCommand
{
    public TemplateCommand() : base(
        displayName: "Template Action",
        description: "Template for new commands",
        groupName: "Templates")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        // Your command logic here
        this.Plugin.Log.Info("Template command executed");
    }
}
```

### HTTP API Integration

```csharp
public class ApiCommand : PluginDynamicCommand
{
    private readonly HttpClient _httpClient = new();

    public ApiCommand() : base("API Call", "Make HTTP request", "Network")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                var response = await _httpClient.GetStringAsync("https://api.example.com/data");
                ProcessApiResponse(response);
            }
            catch (Exception ex)
            {
                this.Plugin.Log.Error(ex, "API call failed");
            }
        });
    }

    private void ProcessApiResponse(string response)
    {
        // Process the API response
        this.ActionImageChanged();
    }
}
```

## Community Samples

### Third-Party Plugins

- **OBS Studio Controller** - Control OBS scenes and sources
- **Discord Status** - Update Discord status from your device  
- **Home Assistant** - Control smart home devices
- **Twitch Chat** - Display and interact with Twitch chat

**[Browse Community Plugins](https://github.com/topics/logi-actions-plugin)**

## Sample Categories

### 🎮 Gaming
- Game launcher shortcuts
- Discord integration
- Streaming controls
- Performance overlays

### 🎨 Creative
- Adobe Creative Suite shortcuts
- Color palette tools
- Asset browsers
- Render queue monitors

### 💼 Productivity
- Calendar integration
- Task management
- Email notifications
- Meeting controls

### 🏠 Smart Home
- Light controls
- Temperature adjustment
- Security system
- Device status

## Getting Started with Samples

### 1. Clone the Repository

```bash
git clone https://github.com/logitech/actions-sdk-samples.git
cd actions-sdk-samples
```

### 2. Open a Sample

```bash
cd SpotifyController
code .
```

### 3. Build and Test

```bash
dotnet build
# Plugin automatically loads in Logi Plugin Service
```

### 4. Customize

Modify the sample code to fit your needs and rebuild.

## Contributing Samples

Want to share your plugin with the community?

1. **Fork** the [samples repository](https://github.com/logitech/actions-sdk-samples)
2. **Create** a new folder for your plugin
3. **Include** source code, README, and example screenshots
4. **Submit** a pull request

### Sample Requirements

- ✅ Complete, working plugin
- ✅ Clear documentation
- ✅ Example screenshots/videos
- ✅ MIT or similar open license
- ✅ Follows SDK best practices

## Learning Resources

### Video Tutorials

- 📺 [Building Your First Plugin (10 min)](https://youtube.com/watch?v=example1)
- 📺 [Advanced Plugin Patterns (25 min)](https://youtube.com/watch?v=example2)
- 📺 [Marketplace Submission Guide (15 min)](https://youtube.com/watch?v=example3)

### Blog Posts

- 📖 [Plugin Architecture Best Practices](https://developer.logitech.com/blog/plugin-architecture)
- 📖 [Performance Optimization Tips](https://developer.logitech.com/blog/performance-tips)
- 📖 [UI Design Guidelines](https://developer.logitech.com/blog/ui-guidelines)

## Need Help?

- 💬 [Developer Discord](https://discord.gg/logitech-dev)
- 📧 [Sample Requests](mailto:samples@logitech.com)
- 🐛 [Report Issues](https://github.com/logitech/actions-sdk-samples/issues)

---

*All samples are provided under the MIT license and are free to use and modify.*