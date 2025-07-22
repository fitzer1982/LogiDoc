# Add a Simple Adjustment

Adjustments allow users to control continuous values using dials and sliders on their Logi Actions devices. This tutorial shows you how to add adjustments to your plugin.

## What is an Adjustment?

An adjustment is a continuous control that responds to dial or slider input from devices like the MX Creative Console or Loupedeck devices. Unlike commands that execute once, adjustments provide real-time feedback as the user turns a dial or moves a slider.

## Basic Adjustment Structure

The basic structure for adding an adjustment is:

```csharp
AddAdjustment("AdjustmentId", "Display Name", (value) => {
    // Adjustment logic here
});
```

### Parameters

* **AdjustmentId** - A unique identifier for the adjustment (used internally)
* **Display Name** - The name shown to users in the G HUB interface
* **Callback** - A lambda expression that receives the adjustment value (typically 0-100)

## Your First Adjustment

Let's start with a simple adjustment that displays the current value:

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
            // Add a simple adjustment
            AddAdjustment("VolumeControl", "Volume Control", (value) => {
                Console.WriteLine($"Volume set to: {value}%");
            });
        }
    }
}
```

## Common Adjustment Examples

### 1. System Volume Control

```csharp
AddAdjustment("SystemVolume", "System Volume", (value) => {
    // Convert percentage to actual volume level (0-100)
    int volumeLevel = (int)value;
    
    // Set system volume (implementation depends on your audio library)
    SetSystemVolume(volumeLevel);
    
    Console.WriteLine($"System volume: {volumeLevel}%");
});
```

### 2. Brightness Control

```csharp
AddAdjustment("ScreenBrightness", "Screen Brightness", (value) => {
    int brightness = (int)value;
    
    // Set screen brightness
    SetScreenBrightness(brightness);
    
    Console.WriteLine($"Screen brightness: {brightness}%");
});
```

### 3. Mouse Sensitivity

```csharp
AddAdjustment("MouseSensitivity", "Mouse Sensitivity", (value) => {
    // Convert percentage to DPI or sensitivity multiplier
    double sensitivity = value / 100.0 * 10.0; // 0-10 range
    
    SetMouseSensitivity(sensitivity);
    
    Console.WriteLine($"Mouse sensitivity: {sensitivity:F1}");
});
```

### 4. Application-Specific Controls

```csharp
AddAdjustment("BrushSize", "Brush Size", (value) => {
    // For photo editing applications
    int brushSize = (int)(value / 100.0 * 200); // 0-200 pixels
    
    // Send to active application
    SendToApplication("brush_size", brushSize);
    
    Console.WriteLine($"Brush size: {brushSize}px");
});
```

## Adjustment Value Handling

### 1. Value Ranges

Adjustments typically provide values from 0 to 100:

```csharp
AddAdjustment("PreciseControl", "Precise Control", (value) => {
    // value is between 0.0 and 100.0
    double normalizedValue = value / 100.0; // 0.0 to 1.0
    
    // Use the normalized value for calculations
    double result = normalizedValue * 255; // 0 to 255
    
    Console.WriteLine($"Normalized value: {normalizedValue:F2}, Result: {result:F0}");
});
```

### 2. Smoothing and Debouncing

For better user experience, you might want to smooth rapid changes:

```csharp
private double lastValue = 0;
private DateTime lastUpdate = DateTime.MinValue;

AddAdjustment("SmoothControl", "Smooth Control", (value) => {
    var now = DateTime.Now;
    
    // Only update if enough time has passed or value changed significantly
    if (now - lastUpdate > TimeSpan.FromMilliseconds(50) || 
        Math.Abs(value - lastValue) > 2.0)
    {
        lastValue = value;
        lastUpdate = now;
        
        // Process the adjustment
        ProcessAdjustment(value);
    }
});
```

### 3. Value Validation

Validate and clamp values to acceptable ranges:

```csharp
AddAdjustment("ValidatedControl", "Validated Control", (value) => {
    // Clamp value to valid range
    double clampedValue = Math.Max(0.0, Math.Min(100.0, value));
    
    // Convert to your application's range
    int applicationValue = (int)(clampedValue / 100.0 * 1000); // 0-1000
    
    // Apply the adjustment
    ApplyAdjustment(applicationValue);
});
```

## Advanced Adjustment Features

### 1. Adjustment with State

Maintain state across adjustment calls:

```csharp
public class MyPlugin : Plugin
{
    private double currentVolume = 50.0;
    private bool isMuted = false;
    
    public override void Initialize()
    {
        AddAdjustment("VolumeWithState", "Volume with State", (value) => {
            if (!isMuted)
            {
                currentVolume = value;
                SetSystemVolume((int)currentVolume);
                Console.WriteLine($"Volume: {currentVolume:F1}%");
            }
        });
        
        AddCommand("ToggleMute", "Toggle Mute", () => {
            isMuted = !isMuted;
            if (isMuted)
            {
                Console.WriteLine("Audio muted");
            }
            else
            {
                Console.WriteLine($"Audio unmuted, volume: {currentVolume:F1}%");
            }
        });
    }
}
```

### 2. Multiple Related Adjustments

Create adjustments that work together:

```csharp
public override void Initialize()
{
    AddAdjustment("RedChannel", "Red Channel", (value) => {
        UpdateColorChannel('R', value);
    });
    
    AddAdjustment("GreenChannel", "Green Channel", (value) => {
        UpdateColorChannel('G', value);
    });
    
    AddAdjustment("BlueChannel", "Blue Channel", (value) => {
        UpdateColorChannel('B', value);
    });
}

private void UpdateColorChannel(char channel, double value)
{
    // Update the color channel
    Console.WriteLine($"{channel} channel: {value:F1}%");
    
    // You might want to update a shared color object
    // and then apply the complete color
}
```

### 3. Adjustment with Feedback

Provide visual or audio feedback:

```csharp
AddAdjustment("FeedbackControl", "Feedback Control", (value) => {
    // Process the adjustment
    ProcessAdjustment(value);
    
    // Provide visual feedback
    if (value > 80)
    {
        Console.WriteLine("⚠️  High value warning!");
    }
    else if (value < 20)
    {
        Console.WriteLine("🔇 Low value");
    }
    else
    {
        Console.WriteLine($"✅ Normal range: {value:F1}%");
    }
});
```

## Best Practices

### 1. Responsive Design

Keep adjustments responsive:

```csharp
AddAdjustment("ResponsiveControl", "Responsive Control", (value) => {
    // Avoid heavy operations in the adjustment callback
    // Use async operations if needed
    Task.Run(() => {
        ProcessAdjustmentAsync(value);
    });
    
    // Provide immediate feedback
    Console.WriteLine($"Adjustment: {value:F1}%");
});
```

### 2. Error Handling

Handle potential errors gracefully:

```csharp
AddAdjustment("SafeAdjustment", "Safe Adjustment", (value) => {
    try
    {
        // Validate input
        if (value < 0 || value > 100)
        {
            Console.WriteLine("Invalid adjustment value");
            return;
        }
        
        // Process adjustment
        ProcessAdjustment(value);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Adjustment failed: {ex.Message}");
    }
});
```

### 3. Performance Optimization

Optimize for performance:

```csharp
private double lastProcessedValue = -1;

AddAdjustment("OptimizedControl", "Optimized Control", (value) => {
    // Only process if value changed significantly
    if (Math.Abs(value - lastProcessedValue) > 1.0)
    {
        lastProcessedValue = value;
        ProcessAdjustment(value);
    }
});
```

## Testing Your Adjustments

Test your adjustments thoroughly:

```csharp
public override void Initialize()
{
    // Test adjustment
    AddAdjustment("TestAdjustment", "Test Adjustment", (value) => {
        Console.WriteLine("=== Adjustment Test ===");
        Console.WriteLine($"Value: {value:F2}");
        Console.WriteLine($"Time: {DateTime.Now:HH:mm:ss.fff}");
        Console.WriteLine($"Plugin: {GetName()}");
        Console.WriteLine("=======================");
    });
}
```

## Next Steps

* [Link the Plugin to an Application](../tutorial/link-plugin-to-application.md) - Connect your plugin to external applications
* [Change a Button Image](../tutorial/change-button-image.md) - Customize button appearances
* [Plugin Features](../plugin-features/manage-plugin-settings.md) - Advanced plugin features 