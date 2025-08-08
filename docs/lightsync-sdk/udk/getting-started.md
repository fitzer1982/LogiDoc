---
id: getting-started
title: Getting Started with UDK/C++
sidebar_label: UDK/C++ Getting Started
description: Learn how to integrate LightSync SDK with Unreal Engine and C++ applications
---

# Getting Started with UDK/C++

This guide will walk you through setting up the LightSync SDK in your Unreal Engine or C++ application.

## Prerequisites

- Unreal Engine 4.27+ or Visual Studio 2019+
- Windows 10/11
- Logitech Gaming Software (LGS) or G HUB installed
- Compatible Logitech gaming device
- Basic C++ knowledge

## Installation

### Step 1: Download the SDK

Download the LightSync SDK DLL and header files from the Logitech developer portal.

### Step 2: Include Headers

Add the SDK header to your project:

```cpp
#include "LogitechGSDK.h"
```

### Step 3: Link the Library

Add the SDK library to your project:

**For Unreal Engine:**
```cpp
// In your .Build.cs file
PublicDependencyModuleNames.AddRange(new string[] { "LogitechGSDK" });
```

**For Visual Studio:**
- Add `LogitechGSDK.lib` to your linker input
- Ensure `LogitechGSDK.dll` is in your executable directory

### Step 4: Initialize the SDK

```cpp
#include "LogitechGSDK.h"
#include <iostream>

int main()
{
    // Initialize the SDK
    bool initialized = LogiLedInit();
    
    if (!initialized)
    {
        std::cout << "Failed to initialize LightSync SDK" << std::endl;
        return -1;
    }
    
    std::cout << "LightSync SDK initialized successfully" << std::endl;
    
    // Your lighting code here
    
    // Cleanup
    LogiLedShutdown();
    return 0;
}
```

## Basic Usage

### Setting LED Colors

```cpp
// Set all LEDs to red
LogiLedSetLighting(100, 0, 0);

// Set specific key to blue
LogiLedSetLightingForKeyWithKeyName(LOGI_LED_A, 0, 0, 255);
```

### Creating Breathing Effects

```cpp
// Create a breathing effect between red and blue
LogiLedSetLightingForTargetZone2(
    LOGI_DEVICETYPE_ALL,
    0, // Zone index
    255, 0, 0, // Red color
    0, 0, 255, // Blue color
    2000 // Duration in milliseconds
);
```

### Zone Control

```cpp
// Control specific zones on RGB devices
LogiLedSetLightingForTargetZone(
    LOGI_DEVICETYPE_RGB,
    0, // Zone 0
    255, 0, 0 // Red color
);
```

## Unreal Engine Integration

### Step 1: Create Plugin

Create a new plugin for LightSync integration:

```cpp
// LogitechLightSyncPlugin.h
#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class FLogitechLightSyncPlugin : public IModuleInterface
{
public:
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;
};
```

### Step 2: Implement Plugin

```cpp
// LogitechLightSyncPlugin.cpp
#include "LogitechLightSyncPlugin.h"
#include "LogitechGSDK.h"

#define LOCTEXT_NAMESPACE "FLogitechLightSyncPlugin"

void FLogitechLightSyncPlugin::StartupModule()
{
    // Initialize SDK when plugin loads
    if (LogiLedInit())
    {
        UE_LOG(LogTemp, Log, TEXT("LightSync SDK initialized"));
    }
    else
    {
        UE_LOG(LogTemp, Warning, TEXT("Failed to initialize LightSync SDK"));
    }
}

void FLogitechLightSyncPlugin::ShutdownModule()
{
    // Cleanup SDK
    LogiLedShutdown();
    UE_LOG(LogTemp, Log, TEXT("LightSync SDK shutdown"));
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FLogitechLightSyncPlugin, LogitechLightSyncPlugin)
```

### Step 3: Create Blueprint Function Library

```cpp
// LogitechLightSyncBPLibrary.h
#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "LogitechGSDK.h"
#include "LogitechLightSyncBPLibrary.generated.h"

UCLASS()
class LOGITECHLIGHTSYNC_API ULogitechLightSyncBPLibrary : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    UFUNCTION(BlueprintCallable, Category = "Logitech LightSync")
    static bool SetAllLights(int32 Red, int32 Green, int32 Blue);
    
    UFUNCTION(BlueprintCallable, Category = "Logitech LightSync")
    static bool SetKeyLight(int32 KeyCode, int32 Red, int32 Green, int32 Blue);
    
    UFUNCTION(BlueprintCallable, Category = "Logitech LightSync")
    static bool CreateBreathingEffect(int32 Red1, int32 Green1, int32 Blue1,
                                    int32 Red2, int32 Green2, int32 Blue2,
                                    int32 Duration);
};
```

### Step 4: Implement Blueprint Functions

```cpp
// LogitechLightSyncBPLibrary.cpp
#include "LogitechLightSyncBPLibrary.h"

bool ULogitechLightSyncBPLibrary::SetAllLights(int32 Red, int32 Green, int32 Blue)
{
    return LogiLedSetLighting(Red, Green, Blue);
}

bool ULogitechLightSyncBPLibrary::SetKeyLight(int32 KeyCode, int32 Red, int32 Green, int32 Blue)
{
    return LogiLedSetLightingForKeyWithKeyName(KeyCode, Red, Green, Blue);
}

bool ULogitechLightSyncBPLibrary::CreateBreathingEffect(int32 Red1, int32 Green1, int32 Blue1,
                                                       int32 Red2, int32 Green2, int32 Blue2,
                                                       int32 Duration)
{
    return LogiLedSetLightingForTargetZone2(LOGI_DEVICETYPE_ALL, 0,
                                          Red1, Green1, Blue1,
                                          Red2, Green2, Blue2,
                                          Duration);
}
```

## Advanced Features

### Device Management

```cpp
class LightSyncManager
{
public:
    static bool IsDeviceConnected()
    {
        // Try to set lighting to test if device is connected
        return LogiLedSetLighting(0, 0, 0);
    }
    
    static void TestAllKeys()
    {
        int keys[] = {LOGI_LED_W, LOGI_LED_A, LOGI_LED_S, LOGI_LED_D};
        int colors[][3] = {{255,0,0}, {0,255,0}, {0,0,255}, {255,255,0}};
        
        for (int i = 0; i < 4; i++)
        {
            LogiLedSetLightingForKeyWithKeyName(keys[i], 
                                              colors[i][0], 
                                              colors[i][1], 
                                              colors[i][2]);
            Sleep(500);
        }
    }
};
```

### Color Utilities

```cpp
struct RGB
{
    int red, green, blue;
    
    RGB(int r, int g, int b) : red(r), green(g), blue(b) {}
};

class ColorUtils
{
public:
    static RGB HSVToRGB(float hue, float saturation, float value)
    {
        int h = (int)(hue * 6);
        float f = hue * 6 - h;
        float p = value * (1 - saturation);
        float q = value * (1 - f * saturation);
        float t = value * (1 - (1 - f) * saturation);
        
        switch (h)
        {
            case 0: return RGB(value * 255, t * 255, p * 255);
            case 1: return RGB(q * 255, value * 255, p * 255);
            case 2: return RGB(p * 255, value * 255, t * 255);
            case 3: return RGB(p * 255, q * 255, value * 255);
            case 4: return RGB(t * 255, p * 255, value * 255);
            case 5: return RGB(value * 255, p * 255, q * 255);
            default: return RGB(0, 0, 0);
        }
    }
};
```

### Animation System

```cpp
class LightAnimation
{
private:
    bool running;
    std::thread animationThread;
    
public:
    void StartRainbowEffect()
    {
        if (running) return;
        
        running = true;
        animationThread = std::thread([this]()
        {
            float hue = 0.0f;
            while (running)
            {
                RGB color = ColorUtils::HSVToRGB(hue, 1.0f, 1.0f);
                LogiLedSetLighting(color.red, color.green, color.blue);
                
                hue += 0.01f;
                if (hue > 1.0f) hue = 0.0f;
                
                std::this_thread::sleep_for(std::chrono::milliseconds(50));
            }
        });
    }
    
    void Stop()
    {
        running = false;
        if (animationThread.joinable())
        {
            animationThread.join();
        }
    }
};
```

## Error Handling

```cpp
class LightSyncManager
{
public:
    static bool SafeSetLighting(int red, int green, int blue)
    {
        try
        {
            return LogiLedSetLighting(red, green, blue);
        }
        catch (const std::exception& e)
        {
            std::cerr << "Error setting lighting: " << e.what() << std::endl;
            return false;
        }
    }
    
    static bool InitializeSDK()
    {
        try
        {
            return LogiLedInit();
        }
        catch (const std::exception& e)
        {
            std::cerr << "Failed to initialize SDK: " << e.what() << std::endl;
            return false;
        }
    }
};
```

## Complete Example

```cpp
#include "LogitechGSDK.h"
#include <iostream>
#include <thread>
#include <chrono>

class LightSyncDemo
{
public:
    static void Run()
    {
        std::cout << "Starting LightSync C++ Demo" << std::endl;
        
        // Initialize SDK
        if (!LogiLedInit())
        {
            std::cout << "Failed to initialize SDK" << std::endl;
            return;
        }
        
        try
        {
            // Basic lighting demo
            DemoBasicLighting();
            std::this_thread::sleep_for(std::chrono::seconds(2));
            
            // Key-specific lighting
            DemoKeyLighting();
            std::this_thread::sleep_for(std::chrono::seconds(2));
            
            // Breathing effect
            DemoBreathingEffect();
            std::this_thread::sleep_for(std::chrono::seconds(3));
            
            // Rainbow effect
            DemoRainbowEffect();
            std::this_thread::sleep_for(std::chrono::seconds(5));
            
        }
        catch (const std::exception& e)
        {
            std::cerr << "Demo error: " << e.what() << std::endl;
        }
        
        // Cleanup
        LogiLedShutdown();
        std::cout << "Demo complete" << std::endl;
    }
    
private:
    static void DemoBasicLighting()
    {
        std::cout << "Setting basic lighting..." << std::endl;
        LogiLedSetLighting(0, 0, 255); // Blue
    }
    
    static void DemoKeyLighting()
    {
        std::cout << "Setting key-specific lighting..." << std::endl;
        int keys[] = {LOGI_LED_W, LOGI_LED_A, LOGI_LED_S, LOGI_LED_D};
        int colors[][3] = {{255,0,0}, {0,255,0}, {0,0,255}, {255,255,0}};
        
        for (int i = 0; i < 4; i++)
        {
            LogiLedSetLightingForKeyWithKeyName(keys[i], 
                                              colors[i][0], 
                                              colors[i][1], 
                                              colors[i][2]);
        }
    }
    
    static void DemoBreathingEffect()
    {
        std::cout << "Creating breathing effect..." << std::endl;
        LogiLedSetLightingForTargetZone2(LOGI_DEVICETYPE_ALL, 0,
                                       255, 0, 0, 0, 0, 255, 2000);
    }
    
    static void DemoRainbowEffect()
    {
        std::cout << "Starting rainbow effect..." << std::endl;
        LightAnimation animation;
        animation.StartRainbowEffect();
        
        std::this_thread::sleep_for(std::chrono::seconds(5));
        animation.Stop();
    }
};

int main()
{
    LightSyncDemo::Run();
    return 0;
}
```

## Best Practices

1. **Always initialize and shutdown properly**
2. **Use RAII for resource management**
3. **Handle exceptions gracefully**
4. **Check return values from SDK calls**
5. **Use appropriate color values (0-255)**
6. **Implement proper threading for animations**
7. **Use smart pointers for memory management**

## Next Steps

- Explore the [API Reference](/docs/lightsync-sdk/udk/api-reference)
- Learn about [Advanced Effects](/docs/lightsync-sdk/udk/advanced-effects)
- Check out [Troubleshooting](/docs/lightsync-sdk/troubleshooting)

## Support

If you encounter issues:

1. Ensure LGS/G HUB is running
2. Check device compatibility
3. Verify DLL is in the correct location
4. Review error codes in the API reference 