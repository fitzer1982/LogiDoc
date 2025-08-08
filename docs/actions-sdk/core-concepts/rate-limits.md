# Rate Limits

Understanding and managing rate limits is crucial for building reliable plugins that work well with external APIs and don't overwhelm system resources.

## Overview

Rate limits prevent plugins from making too many requests in a short time period, protecting both your plugin and external services from overload.

## SDK Rate Limits

### Plugin Service Limits

The Logi Plugin Service enforces these limits:

| Operation | Limit | Window |
|-----------|-------|--------|
| Command Executions | 100/minute | Per plugin |
| Image Updates | 50/minute | Per plugin |
| Setting Changes | 20/minute | Per plugin |
| Log Messages | 200/minute | Per plugin |

### Device Interaction Limits

| Device Type | Touch Updates | LED Updates |
|-------------|---------------|-------------|
| MX Creative Console | 30/second | 60/second |
| Loupedeck CT | 20/second | 40/second |
| Loupedeck Live | 25/second | 50/second |

## Implementing Rate Limiting

### Basic Rate Limiter

```csharp
public class RateLimiter
{
    private readonly Dictionary<string, Queue<DateTime>> _requests = new();
    private readonly int _maxRequests;
    private readonly TimeSpan _timeWindow;

    public RateLimiter(int maxRequests, TimeSpan timeWindow)
    {
        _maxRequests = maxRequests;
        _timeWindow = timeWindow;
    }

    public bool IsAllowed(string key)
    {
        var now = DateTime.UtcNow;
        
        if (!_requests.ContainsKey(key))
        {
            _requests[key] = new Queue<DateTime>();
        }

        var requests = _requests[key];
        
        // Remove old requests outside the time window
        while (requests.Count > 0 && now - requests.Peek() > _timeWindow)
        {
            requests.Dequeue();
        }

        if (requests.Count >= _maxRequests)
        {
            return false; // Rate limit exceeded
        }

        requests.Enqueue(now);
        return true;
    }
}
```

### Using Rate Limiter in Commands

```csharp
public class RateLimitedCommand : PluginDynamicCommand
{
    private readonly RateLimiter _rateLimiter = new(10, TimeSpan.FromMinutes(1));

    public RateLimitedCommand() : base("Rate Limited", "Demonstrates rate limiting", "Demo")
    {
    }

    protected override void RunCommand(string actionParameter)
    {
        if (!_rateLimiter.IsAllowed("command_execution"))
        {
            this.Plugin.Log.Warning("Rate limit exceeded for command execution");
            ShowRateLimitMessage();
            return;
        }

        // Execute command logic
        ExecuteCommand();
    }

    private void ShowRateLimitMessage()
    {
        // Update button to show rate limit status
        this.ActionImageChanged();
    }
}
```

## API Rate Limiting

### HTTP Client with Rate Limiting

```csharp
public class RateLimitedHttpClient
{
    private readonly HttpClient _httpClient;
    private readonly RateLimiter _rateLimiter;

    public RateLimitedHttpClient(int requestsPerMinute)
    {
        _httpClient = new HttpClient();
        _rateLimiter = new RateLimiter(requestsPerMinute, TimeSpan.FromMinutes(1));
    }

    public async Task<HttpResponseMessage> GetAsync(string url)
    {
        if (!_rateLimiter.IsAllowed("http_request"))
        {
            throw new RateLimitExceededException("HTTP rate limit exceeded");
        }

        return await _httpClient.GetAsync(url);
    }
}
```

### Exponential Backoff

```csharp
public class BackoffHttpClient
{
    private readonly HttpClient _httpClient = new();
    private readonly int _maxRetries = 3;

    public async Task<HttpResponseMessage> GetWithBackoffAsync(string url)
    {
        for (int attempt = 0; attempt < _maxRetries; attempt++)
        {
            try
            {
                var response = await _httpClient.GetAsync(url);
                
                if (response.StatusCode == HttpStatusCode.TooManyRequests)
                {
                    var retryAfter = GetRetryAfterDelay(response);
                    await Task.Delay(retryAfter);
                    continue;
                }

                return response;
            }
            catch (HttpRequestException) when (attempt < _maxRetries - 1)
            {
                var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
                await Task.Delay(delay);
            }
        }

        throw new MaxRetriesExceededException("Max retries exceeded");
    }

    private TimeSpan GetRetryAfterDelay(HttpResponseMessage response)
    {
        if (response.Headers.RetryAfter?.Delta.HasValue == true)
        {
            return response.Headers.RetryAfter.Delta.Value;
        }

        return TimeSpan.FromSeconds(60); // Default 1 minute
    }
}
```

## Monitoring Rate Limits

### Rate Limit Metrics

```csharp
public class RateLimitMetrics
{
    private int _totalRequests;
    private int _rateLimitedRequests;
    private DateTime _lastReset = DateTime.UtcNow;

    public void RecordRequest(bool wasRateLimited)
    {
        Interlocked.Increment(ref _totalRequests);
        
        if (wasRateLimited)
        {
            Interlocked.Increment(ref _rateLimitedRequests);
        }
    }

    public RateLimitStats GetStats()
    {
        return new RateLimitStats
        {
            TotalRequests = _totalRequests,
            RateLimitedRequests = _rateLimitedRequests,
            RateLimitPercentage = _totalRequests > 0 ? 
                (double)_rateLimitedRequests / _totalRequests * 100 : 0,
            SinceReset = DateTime.UtcNow - _lastReset
        };
    }
}
```

### Logging Rate Limit Events

```csharp
public class RateLimitLogger
{
    private readonly ILogger _logger;

    public void LogRateLimit(string operation, string details = null)
    {
        _logger.Warning("Rate limit exceeded for {Operation}. {Details}", 
            operation, details ?? "");
    }

    public void LogRateLimitRecovery(string operation)
    {
        _logger.Information("Rate limit recovered for {Operation}", operation);
    }
}
```

## Best Practices

### ✅ Do

- **Implement client-side rate limiting** before making API calls
- **Use exponential backoff** for retries
- **Cache responses** to reduce API calls
- **Batch operations** when possible
- **Monitor rate limit metrics** to optimize performance

### ❌ Don't

- **Ignore rate limit headers** from APIs
- **Retry immediately** after rate limit errors
- **Make unnecessary API calls** in tight loops
- **Overwhelm the Plugin Service** with rapid updates

## Caching Strategies

### Simple Memory Cache

```csharp
public class SimpleCache<T>
{
    private readonly Dictionary<string, CacheItem<T>> _cache = new();
    private readonly TimeSpan _expiry;

    public SimpleCache(TimeSpan expiry)
    {
        _expiry = expiry;
    }

    public bool TryGet(string key, out T value)
    {
        if (_cache.TryGetValue(key, out var item) && 
            DateTime.UtcNow - item.Timestamp < _expiry)
        {
            value = item.Value;
            return true;
        }

        value = default;
        return false;
    }

    public void Set(string key, T value)
    {
        _cache[key] = new CacheItem<T>
        {
            Value = value,
            Timestamp = DateTime.UtcNow
        };
    }
}

public class CacheItem<T>
{
    public T Value { get; set; }
    public DateTime Timestamp { get; set; }
}
```

### API Response Caching

```csharp
public class CachedApiClient
{
    private readonly HttpClient _httpClient = new();
    private readonly SimpleCache<string> _cache = new(TimeSpan.FromMinutes(5));

    public async Task<string> GetCachedAsync(string url)
    {
        if (_cache.TryGet(url, out var cachedResponse))
        {
            return cachedResponse;
        }

        var response = await _httpClient.GetStringAsync(url);
        _cache.Set(url, response);
        
        return response;
    }
}
```

## Error Handling

### Rate Limit Exceptions

```csharp
public class RateLimitExceededException : Exception
{
    public TimeSpan RetryAfter { get; }

    public RateLimitExceededException(string message, TimeSpan retryAfter = default) 
        : base(message)
    {
        RetryAfter = retryAfter;
    }
}

public class MaxRetriesExceededException : Exception
{
    public MaxRetriesExceededException(string message) : base(message)
    {
    }
}
```

### Graceful Degradation

```csharp
public class ResilientCommand : PluginDynamicCommand
{
    private readonly RateLimitedHttpClient _httpClient;
    private string _lastKnownValue = "No data";

    protected override void RunCommand(string actionParameter)
    {
        try
        {
            var data = await _httpClient.GetAsync("https://api.example.com/data");
            _lastKnownValue = await data.Content.ReadAsStringAsync();
        }
        catch (RateLimitExceededException)
        {
            // Use cached/last known value
            this.Plugin.Log.Information("Using cached value due to rate limit");
        }
        catch (Exception ex)
        {
            this.Plugin.Log.Error(ex, "Failed to fetch data");
        }

        // Always update display with available data
        UpdateDisplay(_lastKnownValue);
    }
}
```

## Testing Rate Limits

### Unit Testing

```csharp
[Test]
public void RateLimiter_ExceedsLimit_ReturnsFalse()
{
    var rateLimiter = new RateLimiter(2, TimeSpan.FromMinutes(1));
    
    Assert.IsTrue(rateLimiter.IsAllowed("test"));
    Assert.IsTrue(rateLimiter.IsAllowed("test"));
    Assert.IsFalse(rateLimiter.IsAllowed("test")); // Should be rate limited
}

[Test]
public async Task RateLimiter_AfterTimeWindow_AllowsRequests()
{
    var rateLimiter = new RateLimiter(1, TimeSpan.FromMilliseconds(100));
    
    Assert.IsTrue(rateLimiter.IsAllowed("test"));
    Assert.IsFalse(rateLimiter.IsAllowed("test"));
    
    await Task.Delay(150); // Wait for time window to pass
    
    Assert.IsTrue(rateLimiter.IsAllowed("test"));
}
```

## Next Steps

- **Learn about core objects**: [Objects](./objects.md)
- **Implement webhooks**: [Webhooks](./webhooks.md)
- **See practical examples**: [Guides & Tutorials](../guides/payment-intents.md)

---

*Proper rate limiting ensures your plugin is reliable and respectful of system resources.*