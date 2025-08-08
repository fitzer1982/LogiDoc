# Webhooks

Webhooks enable your plugin to receive real-time notifications from external services and respond to events automatically.

## Overview

Webhooks are HTTP callbacks that external services send to your plugin when specific events occur. This enables real-time integrations without constant polling.

## Setting Up Webhooks

### Basic Webhook Handler

```csharp
public class WebhookCommand : PluginDynamicCommand
{
    private readonly HttpListener _listener;
    
    public WebhookCommand() : base("Webhook Handler", "Receives webhooks", "Integration")
    {
        _listener = new HttpListener();
        _listener.Prefixes.Add("http://localhost:8080/webhook/");
        StartListening();
    }

    private async void StartListening()
    {
        _listener.Start();
        
        while (_listener.IsListening)
        {
            try
            {
                var context = await _listener.GetContextAsync();
                await ProcessWebhook(context);
            }
            catch (Exception ex)
            {
                this.Plugin.Log.Error(ex, "Webhook processing failed");
            }
        }
    }

    private async Task ProcessWebhook(HttpListenerContext context)
    {
        var request = context.Request;
        var response = context.Response;

        // Read webhook payload
        using var reader = new StreamReader(request.InputStream);
        var payload = await reader.ReadToEndAsync();

        // Process the webhook
        await HandleWebhookPayload(payload, request.Headers);

        // Send response
        response.StatusCode = 200;
        response.Close();
    }
}
```

## Common Webhook Patterns

### GitHub Integration

```csharp
private async Task HandleGitHubWebhook(string payload, NameValueCollection headers)
{
    var signature = headers["X-Hub-Signature-256"];
    
    // Verify webhook signature
    if (!VerifyGitHubSignature(payload, signature))
    {
        return;
    }

    var webhookData = JsonSerializer.Deserialize<GitHubWebhook>(payload);
    
    switch (webhookData.Action)
    {
        case "push":
            await HandlePushEvent(webhookData);
            break;
        case "pull_request":
            await HandlePullRequestEvent(webhookData);
            break;
    }
}

private bool VerifyGitHubSignature(string payload, string signature)
{
    var secret = Environment.GetEnvironmentVariable("GITHUB_WEBHOOK_SECRET");
    var computedSignature = ComputeHmacSha256(payload, secret);
    return signature == $"sha256={computedSignature}";
}
```

### Slack Integration

```csharp
private async Task HandleSlackWebhook(string payload)
{
    var slackEvent = JsonSerializer.Deserialize<SlackEvent>(payload);
    
    if (slackEvent.Type == "url_verification")
    {
        // Respond to Slack's verification challenge
        return slackEvent.Challenge;
    }
    
    if (slackEvent.Event?.Type == "message")
    {
        await ProcessSlackMessage(slackEvent.Event);
    }
}

private async Task ProcessSlackMessage(SlackMessage message)
{
    // Update device display with new message
    this.ActionImageChanged();
    
    // Optionally trigger device notification
    await TriggerDeviceNotification($"New message: {message.Text}");
}
```

## Security Best Practices

### Signature Verification

Always verify webhook signatures to ensure authenticity:

```csharp
private bool VerifyWebhookSignature(string payload, string signature, string secret)
{
    using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
    var computedSignature = Convert.ToHexString(computedHash).ToLower();
    
    return signature.Equals($"sha256={computedSignature}", StringComparison.OrdinalIgnoreCase);
}
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```csharp
private readonly Dictionary<string, DateTime> _lastRequestTimes = new();
private readonly TimeSpan _rateLimitWindow = TimeSpan.FromMinutes(1);

private bool IsRateLimited(string clientId)
{
    if (_lastRequestTimes.TryGetValue(clientId, out var lastRequest))
    {
        return DateTime.UtcNow - lastRequest < _rateLimitWindow;
    }
    
    _lastRequestTimes[clientId] = DateTime.UtcNow;
    return false;
}
```

## Webhook Data Models

### Generic Webhook Model

```csharp
public class WebhookPayload
{
    public string Event { get; set; }
    public DateTime Timestamp { get; set; }
    public Dictionary<string, object> Data { get; set; }
    public string Source { get; set; }
}
```

### Service-Specific Models

```csharp
public class GitHubWebhook
{
    public string Action { get; set; }
    public Repository Repository { get; set; }
    public PushEvent Push { get; set; }
}

public class SlackEvent
{
    public string Type { get; set; }
    public string Challenge { get; set; }
    public SlackMessage Event { get; set; }
}
```

## Error Handling

### Robust Error Processing

```csharp
private async Task ProcessWebhook(HttpListenerContext context)
{
    try
    {
        var payload = await ReadPayload(context.Request);
        await HandleWebhookPayload(payload);
        
        context.Response.StatusCode = 200;
    }
    catch (JsonException ex)
    {
        this.Plugin.Log.Warning(ex, "Invalid JSON in webhook payload");
        context.Response.StatusCode = 400;
    }
    catch (UnauthorizedAccessException ex)
    {
        this.Plugin.Log.Warning(ex, "Unauthorized webhook request");
        context.Response.StatusCode = 401;
    }
    catch (Exception ex)
    {
        this.Plugin.Log.Error(ex, "Webhook processing error");
        context.Response.StatusCode = 500;
    }
    finally
    {
        context.Response.Close();
    }
}
```

## Testing Webhooks

### Local Testing with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Expose local webhook endpoint
ngrok http 8080

# Use the generated URL in your webhook configuration
# https://abc123.ngrok.io/webhook
```

### Mock Webhook Testing

```csharp
[Test]
public async Task TestWebhookProcessing()
{
    var mockPayload = new WebhookPayload
    {
        Event = "test_event",
        Timestamp = DateTime.UtcNow,
        Data = new Dictionary<string, object> { { "key", "value" } }
    };
    
    var json = JsonSerializer.Serialize(mockPayload);
    await ProcessWebhookPayload(json);
    
    // Assert expected behavior
    Assert.IsTrue(EventWasProcessed);
}
```

## Performance Considerations

### Async Processing

```csharp
private async Task HandleWebhookPayload(string payload)
{
    // Process webhook asynchronously to avoid blocking
    _ = Task.Run(async () =>
    {
        try
        {
            await ProcessPayloadAsync(payload);
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Async webhook processing failed");
        }
    });
}
```

### Webhook Queue

For high-volume webhooks, implement a queue:

```csharp
private readonly ConcurrentQueue<string> _webhookQueue = new();
private readonly SemaphoreSlim _processingLock = new(1, 1);

private async Task QueueWebhook(string payload)
{
    _webhookQueue.Enqueue(payload);
    
    if (await _processingLock.WaitAsync(0))
    {
        _ = Task.Run(ProcessWebhookQueue);
    }
}

private async Task ProcessWebhookQueue()
{
    try
    {
        while (_webhookQueue.TryDequeue(out var payload))
        {
            await ProcessPayloadAsync(payload);
        }
    }
    finally
    {
        _processingLock.Release();
    }
}
```

## Common Use Cases

### Build Status Notifications

```csharp
private async Task HandleBuildWebhook(BuildWebhook webhook)
{
    var status = webhook.Status;
    var color = status == "success" ? Color.Green : Color.Red;
    
    // Update device LED or display
    await UpdateDeviceStatus(status, color);
    
    // Show notification
    if (status == "failed")
    {
        await ShowNotification($"Build failed: {webhook.Project}");
    }
}
```

### Social Media Monitoring

```csharp
private async Task HandleSocialWebhook(SocialWebhook webhook)
{
    if (webhook.Mentions.Contains("@yourhandle"))
    {
        // Light up device when mentioned
        await TriggerMentionAlert();
        
        // Update counter
        IncrementMentionCount();
    }
}
```

## Cleanup

Always clean up webhook listeners:

```csharp
public override void Unload()
{
    _listener?.Stop();
    _listener?.Close();
    _processingLock?.Dispose();
}
```

## Next Steps

- **Learn about performance limits**: [Rate Limits](./rate-limits.md)
- **See webhook examples**: [Guides & Tutorials](../guides/webhooks-guide.md)
- **Explore API integration**: [API Reference](../api-reference.md)

---

*Webhooks enable powerful real-time integrations with external services.*