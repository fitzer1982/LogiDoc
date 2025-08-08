# Webhooks Integration Guide

Practical guide for integrating webhooks into your Logi Actions plugins for real-time external service integration.

## Overview

This guide shows you how to implement webhook endpoints in your plugins to receive real-time notifications from external services.

## Basic Webhook Setup

```csharp
public class WebhookIntegration : PluginDynamicCommand
{
    private readonly HttpListener _listener;
    private readonly string _webhookUrl = "http://localhost:8080/webhook/";

    public WebhookIntegration() : base("Webhook Receiver", "Receives webhook notifications", "Integration")
    {
        _listener = new HttpListener();
        _listener.Prefixes.Add(_webhookUrl);
        StartWebhookListener();
    }

    private async void StartWebhookListener()
    {
        try
        {
            _listener.Start();
            this.Plugin.Log.Info($"Webhook listener started at {_webhookUrl}");

            while (_listener.IsListening)
            {
                var context = await _listener.GetContextAsync();
                _ = Task.Run(() => ProcessWebhook(context));
            }
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Webhook listener error");
        }
    }

    private async Task ProcessWebhook(HttpListenerContext context)
    {
        try
        {
            using var reader = new StreamReader(context.Request.InputStream);
            var payload = await reader.ReadToEndAsync();

            // Process the webhook payload
            await HandleWebhookData(payload);

            // Send success response
            context.Response.StatusCode = 200;
            await context.Response.OutputStream.WriteAsync(Encoding.UTF8.GetBytes("OK"));
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Webhook processing failed");
            context.Response.StatusCode = 500;
        }
        finally
        {
            context.Response.Close();
        }
    }

    private async Task HandleWebhookData(string payload)
    {
        // Parse and handle webhook data
        var data = JsonSerializer.Deserialize<WebhookData>(payload);
        
        // Update plugin state based on webhook
        this.ActionImageChanged();
    }

    protected override void RunCommand(string actionParameter)
    {
        // Manual trigger or configuration
    }

    public override void Dispose()
    {
        _listener?.Stop();
        _listener?.Close();
        base.Dispose();
    }
}

public class WebhookData
{
    public string Event { get; set; }
    public DateTime Timestamp { get; set; }
    public Dictionary<string, object> Data { get; set; }
}
```

## Next Steps

- **Learn about core concepts**: [Objects](../core-concepts/objects.md)
- **See more examples**: [Sample Projects](../samples.md)