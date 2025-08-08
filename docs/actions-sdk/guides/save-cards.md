# Building Adjustments

Learn how to create encoder adjustments that respond to rotation and provide continuous value control.

## Overview

Adjustments handle encoder rotations and provide smooth, continuous control over values like volume, brightness, or any numeric parameter.

## Basic Adjustment

```csharp
public class VolumeAdjustment : PluginDynamicAdjustment
{
    private int _volume = 50; // Default volume

    public VolumeAdjustment() : base(
        displayName: "System Volume",
        description: "Adjust system volume",
        groupName: "Audio",
        hasReset: true)
    {
    }

    protected override void ApplyAdjustment(string actionParameter, int diff)
    {
        // Update volume with bounds checking
        _volume = Math.Max(0, Math.Min(100, _volume + diff));
        
        // Apply to system
        SetSystemVolume(_volume);
        
        // Notify service of value change
        this.AdjustmentValueChanged(actionParameter);
    }

    protected override void RunCommand(string actionParameter)
    {
        // Reset to default when encoder is pressed
        _volume = 50;
        SetSystemVolume(_volume);
        this.AdjustmentValueChanged(actionParameter);
    }

    protected override string GetAdjustmentValue(string actionParameter)
    {
        return $"{_volume}%";
    }

    private void SetSystemVolume(int volume)
    {
        // Implementation to set system volume
        this.Plugin.Log.Info($"Volume set to {volume}%");
    }
}
```

## Advanced Patterns

### Multi-Parameter Adjustment

```csharp
public class ColorAdjustment : PluginDynamicAdjustment
{
    private readonly Dictionary<string, int> _values = new()
    {
        ["red"] = 128,
        ["green"] = 128,
        ["blue"] = 128
    };

    public ColorAdjustment() : base()
    {
        this.AddParameter("red", "Red Channel", "Color");
        this.AddParameter("green", "Green Channel", "Color");
        this.AddParameter("blue", "Blue Channel", "Color");
    }

    protected override void ApplyAdjustment(string actionParameter, int diff)
    {
        if (_values.ContainsKey(actionParameter))
        {
            _values[actionParameter] = Math.Max(0, Math.Min(255, _values[actionParameter] + diff));
            UpdateColor();
            this.AdjustmentValueChanged(actionParameter);
        }
    }

    protected override string GetAdjustmentValue(string actionParameter)
    {
        return _values.TryGetValue(actionParameter, out var value) ? value.ToString() : "0";
    }

    private void UpdateColor()
    {
        var color = Color.FromArgb(_values["red"], _values["green"], _values["blue"]);
        // Apply color to device or application
    }
}
```

## Next Steps

- **Learn webhooks**: [Webhooks Guide](./webhooks-guide.md)
- **See more examples**: [Sample Projects](../samples.md)