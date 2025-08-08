---
id: getting-started
title: Getting Started with Java
sidebar_label: Java Getting Started
description: Learn how to integrate LightSync SDK with Java applications
---

# Getting Started with Java

This guide will walk you through setting up the LightSync SDK in your Java application.

## Prerequisites

- Java Development Kit (JDK) 8 or later
- IDE: IntelliJ IDEA, Eclipse, or VS Code
- Logitech Gaming Software (LGS) or G HUB installed
- Compatible Logitech gaming device
- JNA (Java Native Access) library

## Installation

### Step 1: Add Dependencies

Add JNA to your project dependencies:

**Maven:**
```xml
<dependency>
    <groupId>net.java.dev.jna</groupId>
    <artifactId>jna</artifactId>
    <version>5.12.1</version>
</dependency>
```

**Gradle:**
```gradle
implementation 'net.java.dev.jna:jna:5.12.1'
```

### Step 2: Create the SDK Interface

Create a Java interface to map the native SDK functions:

```java
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;

public interface LogitechGSDK extends Library {
    LogitechGSDK INSTANCE = Native.load(
        Platform.isWindows() ? "LogitechGSDK" : "logitechgsdk",
        LogitechGSDK.class
    );
    
    // SDK Functions
    boolean LogiLedInit();
    void LogiLedShutdown();
    boolean LogiLedSetLighting(int redPercentage, int greenPercentage, int bluePercentage);
    boolean LogiLedSetLightingForKeyWithKeyName(int keyName, int red, int green, int blue);
    boolean LogiLedSetLightingForTargetZone(int deviceType, int zone, int red, int green, int blue);
    boolean LogiLedSetLightingForTargetZone2(int deviceType, int zone, int red1, int green1, int blue1, int red2, int green2, int blue2, int duration);
    
    // Constants
    int LOGI_DEVICETYPE_ALL = 0;
    int LOGI_DEVICETYPE_MONOCHROME = 1;
    int LOGI_DEVICETYPE_RGB = 2;
    int LOGI_DEVICETYPE_PERKEY_RGB = 3;
    
    // Key constants
    int LOGI_LED_A = 0x04;
    int LOGI_LED_S = 0x16;
    int LOGI_LED_D = 0x07;
    int LOGI_LED_W = 0x1A;
}
```

### Step 3: Initialize the SDK

```java
import com.sun.jna.Library;

public class LightSyncExample {
    public static void main(String[] args) {
        // Initialize the SDK
        boolean initialized = LogitechGSDK.INSTANCE.LogiLedInit();
        
        if (!initialized) {
            System.out.println("Failed to initialize LightSync SDK");
            return;
        }
        
        System.out.println("LightSync SDK initialized successfully");
        
        try {
            // Your lighting code here
            setBasicLighting();
        } finally {
            // Cleanup
            LogitechGSDK.INSTANCE.LogiLedShutdown();
            System.out.println("SDK shutdown complete");
        }
    }
    
    private static void setBasicLighting() {
        // Set all LEDs to blue
        LogitechGSDK.INSTANCE.LogiLedSetLighting(0, 0, 100);
    }
}
```

## Basic Usage

### Setting LED Colors

```java
// Set all LEDs to red
LogitechGSDK.INSTANCE.LogiLedSetLighting(100, 0, 0);

// Set specific key to blue
LogitechGSDK.INSTANCE.LogiLedSetLightingForKeyWithKeyName(
    LogitechGSDK.LOGI_LED_A, 
    0, 0, 255
);
```

### Creating Breathing Effects

```java
// Create a breathing effect between red and blue
LogitechGSDK.INSTANCE.LogiLedSetLightingForTargetZone2(
    LogitechGSDK.LOGI_DEVICETYPE_ALL,
    0, // Zone index
    255, 0, 0, // Red color
    0, 0, 255, // Blue color
    2000 // Duration in milliseconds
);
```

### Zone Control

```java
// Control specific zones on RGB devices
LogitechGSDK.INSTANCE.LogiLedSetLightingForTargetZone(
    LogitechGSDK.LOGI_DEVICETYPE_RGB,
    0, // Zone 0
    255, 0, 0 // Red color
);
```

## Advanced Features

### Device Detection

```java
public class DeviceManager {
    public static boolean isDeviceConnected() {
        // Try to set lighting to test if device is connected
        boolean result = LogitechGSDK.INSTANCE.LogiLedSetLighting(0, 0, 0);
        return result;
    }
    
    public static void testAllKeys() {
        int[] keys = {
            LogitechGSDK.LOGI_LED_A,
            LogitechGSDK.LOGI_LED_S,
            LogitechGSDK.LOGI_LED_D,
            LogitechGSDK.LOGI_LED_W
        };
        
        for (int key : keys) {
            LogitechGSDK.INSTANCE.LogiLedSetLightingForKeyWithKeyName(key, 255, 255, 255);
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}
```

### Color Management

```java
public class ColorUtils {
    public static class RGB {
        public int red, green, blue;
        
        public RGB(int red, int green, int blue) {
            this.red = red;
            this.green = green;
            this.blue = blue;
        }
    }
    
    public static RGB hsvToRgb(float hue, float saturation, float value) {
        // HSV to RGB conversion
        int h = (int) (hue * 6);
        float f = hue * 6 - h;
        float p = value * (1 - saturation);
        float q = value * (1 - f * saturation);
        float t = value * (1 - (1 - f) * saturation);
        
        switch (h) {
            case 0: return new RGB((int)(value * 255), (int)(t * 255), (int)(p * 255));
            case 1: return new RGB((int)(q * 255), (int)(value * 255), (int)(p * 255));
            case 2: return new RGB((int)(p * 255), (int)(value * 255), (int)(t * 255));
            case 3: return new RGB((int)(p * 255), (int)(q * 255), (int)(value * 255));
            case 4: return new RGB((int)(t * 255), (int)(p * 255), (int)(value * 255));
            case 5: return new RGB((int)(value * 255), (int)(p * 255), (int)(q * 255));
            default: return new RGB(0, 0, 0);
        }
    }
}
```

### Animation System

```java
public class LightAnimation {
    private volatile boolean running = false;
    private Thread animationThread;
    
    public void startRainbowEffect() {
        if (running) return;
        
        running = true;
        animationThread = new Thread(() -> {
            float hue = 0.0f;
            while (running) {
                RGB color = ColorUtils.hsvToRgb(hue, 1.0f, 1.0f);
                LogitechGSDK.INSTANCE.LogiLedSetLighting(
                    color.red, color.green, color.blue
                );
                
                hue += 0.01f;
                if (hue > 1.0f) hue = 0.0f;
                
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
        animationThread.start();
    }
    
    public void stop() {
        running = false;
        if (animationThread != null) {
            animationThread.interrupt();
        }
    }
}
```

## Error Handling

```java
public class LightSyncManager {
    private static final LogitechGSDK sdk = LogitechGSDK.INSTANCE;
    
    public static boolean safeSetLighting(int red, int green, int blue) {
        try {
            return sdk.LogiLedSetLighting(red, green, blue);
        } catch (Exception e) {
            System.err.println("Error setting lighting: " + e.getMessage());
            return false;
        }
    }
    
    public static boolean initializeSDK() {
        try {
            return sdk.LogiLedInit();
        } catch (Exception e) {
            System.err.println("Failed to initialize SDK: " + e.getMessage());
            return false;
        }
    }
}
```

## Complete Example

```java
import com.sun.jna.Library;
import com.sun.jna.Native;

public class LightSyncDemo {
    public static void main(String[] args) {
        System.out.println("Starting LightSync Java Demo");
        
        // Initialize SDK
        if (!LogitechGSDK.INSTANCE.LogiLedInit()) {
            System.out.println("Failed to initialize SDK");
            return;
        }
        
        try {
            // Basic lighting demo
            demoBasicLighting();
            Thread.sleep(2000);
            
            // Key-specific lighting
            demoKeyLighting();
            Thread.sleep(2000);
            
            // Breathing effect
            demoBreathingEffect();
            Thread.sleep(3000);
            
            // Rainbow effect
            demoRainbowEffect();
            Thread.sleep(5000);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            // Cleanup
            LogitechGSDK.INSTANCE.LogiLedShutdown();
            System.out.println("Demo complete");
        }
    }
    
    private static void demoBasicLighting() {
        System.out.println("Setting basic lighting...");
        LogitechGSDK.INSTANCE.LogiLedSetLighting(0, 0, 255); // Blue
    }
    
    private static void demoKeyLighting() {
        System.out.println("Setting key-specific lighting...");
        int[] keys = {LogitechGSDK.LOGI_LED_W, LogitechGSDK.LOGI_LED_A, 
                     LogitechGSDK.LOGI_LED_S, LogitechGSDK.LOGI_LED_D};
        int[][] colors = {{255,0,0}, {0,255,0}, {0,0,255}, {255,255,0}};
        
        for (int i = 0; i < keys.length; i++) {
            LogitechGSDK.INSTANCE.LogiLedSetLightingForKeyWithKeyName(
                keys[i], colors[i][0], colors[i][1], colors[i][2]
            );
        }
    }
    
    private static void demoBreathingEffect() {
        System.out.println("Creating breathing effect...");
        LogitechGSDK.INSTANCE.LogiLedSetLightingForTargetZone2(
            LogitechGSDK.LOGI_DEVICETYPE_ALL, 0,
            255, 0, 0, 0, 0, 255, 2000
        );
    }
    
    private static void demoRainbowEffect() {
        System.out.println("Starting rainbow effect...");
        LightAnimation animation = new LightAnimation();
        animation.startRainbowEffect();
        
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            animation.stop();
        }
    }
}
```

## Best Practices

1. **Always initialize and shutdown properly**
2. **Use try-finally blocks for cleanup**
3. **Handle exceptions gracefully**
4. **Check return values from SDK calls**
5. **Use appropriate color values (0-255)**
6. **Implement proper threading for animations**

## Next Steps

- Explore the [API Reference](/docs/lightsync-sdk/java/api-reference)
- Learn about [Advanced Effects](/docs/lightsync-sdk/java/advanced-effects)
- Check out [Troubleshooting](/docs/lightsync-sdk/troubleshooting)

## Support

If you encounter issues:

1. Ensure LGS/G HUB is running
2. Check device compatibility
3. Verify JNA is properly configured
4. Review error codes in the API reference 