---
id: getting-started
title: Getting Started with C#
sidebar_label: C# Getting Started
description: Learn how to integrate LightSync SDK with C# applications
---

# Getting Started with C#

This guide will walk you through setting up the LightSync SDK in your C# application.

## Prerequisites

- Visual Studio 2019 or later (or Visual Studio Code)
- .NET Framework 4.7.2 or later (or .NET Core 3.1+)
- Logitech Gaming Software (LGS) or G HUB installed
- Compatible Logitech gaming device

## Installation

### Step 1: Download the SDK

Download the LightSync SDK from the Logitech developer portal or include the DLL in your project.

### Step 2: Add References

Add the following references to your C# project:

```csharp
using LogitechGSDK;
using LogitechGSDK.Lighting;
```

### Step 3: Initialize the SDK

```csharp
using System;
using LogitechGSDK;
using LogitechGSDK.Lighting;

class Program
{
    static void Main(string[] args)
    {
        // Initialize the SDK
        bool initialized = LogitechGSDK.LogiLedInit();
        
        if (!initialized)
        {
            Console.WriteLine("Failed to initialize LightSync SDK");
            return;
        }
        
        Console.WriteLine("LightSync SDK initialized successfully");
        
        // Your lighting code here
        
        // Cleanup
        LogitechGSDK.LogiLedShutdown();
    }
}
```

## Basic Usage

### Setting LED Colors

```csharp
// Set all LEDs to red
LogitechGSDK.LogiLedSetLighting(100, 0, 0);

// Set specific LED zone to blue
LogitechGSDK.LogiLedSetLightingForKeyWithKeyName(
    LogitechGSDK.LOGI_LED.LOGI_LED_A, 
    0, 0, 100
);
```

### Creating Breathing Effects

```csharp
// Create a breathing effect on all LEDs
LogitechGSDK.LogiLedSetLightingForTargetZone(
    LogitechGSDK.LOGI_DEVICETYPE.LOGI_DEVICETYPE_ALL,
    0, // Zone index
    100, 0, 0, // Red color
    0, 0, 100, // Blue color
    1000 // Duration in milliseconds
);
```

### Audio Integration

```csharp
// Enable audio visualization
LogitechGSDK.LogiLedSetLightingFromBitmap(bitmapData);

// Or use the audio callback
LogitechGSDK.LogiLedSetCallback(callbackFunction);
```

## Advanced Features

### Device Enumeration

```csharp
// Get connected devices
var devices = LogitechGSDK.LogiGetConnectedDevices();
foreach (var device in devices)
{
    Console.WriteLine($"Device: {device.Name}, Type: {device.Type}");
}
```

### Zone Control

```csharp
// Control specific zones on a device
LogitechGSDK.LogiLedSetLightingForTargetZone(
    LogitechGSDK.LOGI_DEVICETYPE.LOGI_DEVICETYPE_KEYBOARD,
    0, // Zone 0
    255, 0, 0 // Red color
);
```

### Profile Management

```csharp
// Save current lighting as a profile
LogitechGSDK.LogiLedSaveCurrentLighting();

// Load a saved profile
LogitechGSDK.LogiLedRestoreLighting();
```

## Error Handling

Always check return values and handle errors appropriately:

```csharp
bool result = LogitechGSDK.LogiLedSetLighting(100, 0, 0);
if (!result)
{
    Console.WriteLine("Failed to set lighting");
    // Handle error
}
```

## Best Practices

1. **Always initialize and shutdown properly**
2. **Check device compatibility before setting effects**
3. **Use appropriate color values (0-255)**
4. **Handle errors gracefully**
5. **Clean up resources when done**

## Example: Complete Application

```csharp
using System;
using System.Threading;
using LogitechGSDK;
using LogitechGSDK.Lighting;

class LightSyncExample
{
    static void Main(string[] args)
    {
        Console.WriteLine("Starting LightSync C# Example");
        
        // Initialize SDK
        if (!LogitechGSDK.LogiLedInit())
        {
            Console.WriteLine("Failed to initialize SDK");
            return;
        }
        
        try
        {
            // Set initial lighting
            LogitechGSDK.LogiLedSetLighting(0, 0, 100); // Blue
            Thread.Sleep(1000);
            
            // Create breathing effect
            LogitechGSDK.LogiLedSetLightingForTargetZone(
                LOGI_DEVICETYPE.LOGI_DEVICETYPE_ALL,
                0, 100, 0, 0, 0, 0, 100, 2000
            );
            
            Thread.Sleep(3000);
            
            // Set individual keys
            LogitechGSDK.LogiLedSetLightingForKeyWithKeyName(
                LOGI_LED.LOGI_LED_W, 255, 255, 0
            );
            LogitechGSDK.LogiLedSetLightingForKeyWithKeyName(
                LOGI_LED.LOGI_LED_A, 255, 0, 255
            );
            LogitechGSDK.LogiLedSetLightingForKeyWithKeyName(
                LOGI_LED.LOGI_LED_S, 0, 255, 255
            );
            LogitechGSDK.LogiLedSetLightingForKeyWithKeyName(
                LOGI_LED.LOGI_LED_D, 255, 255, 255
            );
            
            Thread.Sleep(2000);
        }
        finally
        {
            // Cleanup
            LogitechGSDK.LogiLedShutdown();
            Console.WriteLine("SDK shutdown complete");
        }
    }
}
```

## Next Steps

- Explore the [API Reference](/docs/lightsync-sdk/csharp/api-reference)
- Learn about [Advanced Effects](/docs/lightsync-sdk/csharp/advanced-effects)
- Check out [Troubleshooting](/docs/lightsync-sdk/troubleshooting)

## Support

If you encounter issues:

1. Ensure LGS/G HUB is running
2. Check device compatibility
3. Verify SDK initialization
4. Review error codes in the API reference 