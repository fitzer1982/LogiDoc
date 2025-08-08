# Installation

Install the Logi Actions SDK and set up your development environment for plugin creation.

## Install LogiPluginTool

The LogiPluginTool is a command-line utility that helps you create, build, and package plugins.

### Global Installation

```bash
dotnet tool install --global LogiPluginTool
```

### Verify Installation

```bash
logiplugintool --version
```

You should see the current version number.

## Install Host Software

Choose the appropriate host software for your target devices:

### Logitech Options+

For Logitech MX Creative Console:

1. Download from [logitech.com/software/options](https://www.logitech.com/software/options.html)
2. Install and restart your computer
3. Connect your device and complete setup

### Loupedeck Software

For Loupedeck devices:

1. Download from [loupedeck.com/downloads](https://loupedeck.com/downloads/)
2. Install and restart your computer  
3. Connect your device and complete setup

## Project Templates

### Create New Plugin

```bash
logiplugintool generate MyFirstPlugin
cd MyFirstPlugin
```

This creates a complete plugin project structure:

```
MyFirstPlugin/
├── src/
│   ├── MyFirstPlugin.cs
│   ├── MyFirstPluginApplication.cs
│   └── MyFirstPlugin.csproj
├── metadata/
│   ├── LoupedeckPackage.yaml
│   └── Icon256x256.png
└── README.md
```

### Build Plugin

```bash
dotnet build
```

### Test Plugin

The build process automatically creates a `.link` file that tells the Logi Plugin Service where to load your plugin:

**Windows**: `%LOCALAPPDATA%\Logi\LogiPluginService\Plugins\MyFirstPlugin.link`  
**macOS**: `~/Library/Application Support/Logi/LogiPluginService/Plugins/MyFirstPlugin.link`

## IDE Setup

### Visual Studio Code

1. Install the [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
2. Open your plugin folder: `code MyFirstPlugin`
3. Press `F5` to build and debug

### Visual Studio 2022

1. Open `MyFirstPlugin.sln`
2. Set the startup project to your plugin
3. Press `F5` to build and debug

### JetBrains Rider

1. Open the solution file
2. Configure the run configuration
3. Press `F5` to build and debug

## Troubleshooting

### Plugin Not Appearing

1. **Restart Plugin Service**: In Options+/Loupedeck settings, select "Restart Logi Plugin Service"
2. **Check Build Output**: Ensure `dotnet build` completed without errors
3. **Verify .link File**: Check that the `.link` file exists in the plugins directory

### Build Errors

```bash
# Clean and rebuild
dotnet clean
dotnet build
```

### Permission Issues

Run your IDE as administrator if you encounter file access errors.

## Next Steps

✅ **Installation Complete?** → Continue to [Authentication](./authentication.md)  
🚀 **Ready to code?** → Jump to [Quick Start](./quick-start.md)  
❓ **Having issues?** → Check [FAQ](./faq.md)

---

*Estimated completion time: 10 minutes*