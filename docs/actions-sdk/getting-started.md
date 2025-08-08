---
sidebar_position: 2
---

# Getting Started

Welcome to the Logi Actions SDK! This guide will help you set up your development environment and create your first plugin in under 10 minutes.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Development Environment**: Visual Studio, VS Code, or JetBrains Rider
- [ ] **.NET 8.0+ SDK**: [Download from Microsoft](https://dotnet.microsoft.com/download/dotnet/8.0)
- [ ] **Host Software**: Logitech Options+ or Loupedeck Software installed
- [ ] **Test Device**: A supported device for testing (see [Overview](./overview.md#supported-devices))
- [ ] **Basic C# Knowledge**: Familiarity with .NET development

## Account Setup

### 1. Create Developer Account

:::info
**Time Estimate**: 2 minutes
:::

1. Visit the [Logitech Developer Portal](https://developer.logitech.com)
2. Sign up with your email address
3. Verify your email and complete your profile
4. Accept the Developer Agreement

### 2. Generate API Keys

:::tip
Keep your API keys secure and never commit them to version control.
:::

1. Navigate to **Dashboard** → **API Keys**
2. Click **Generate New Key**
3. Copy your API key - you'll need it for authentication
4. Note the difference between **Sandbox** and **Production** keys

## Environment Setup

### Sandbox vs Production

| Environment | Purpose | Device Behavior |
|-------------|---------|-----------------|
| **Sandbox** | Development & testing | Safe testing environment |
| **Production** | Live plugins | Real user devices |

:::warning
Always test thoroughly in Sandbox before deploying to Production.
:::

## Verify Installation

Run this command to verify your .NET installation:

```bash
dotnet --version
```

You should see version 8.0 or higher.

## Next Steps

✅ **Environment Ready?** → Continue to [Installation](./installation.md)  
📚 **Want to understand the basics first?** → Read [Core Concepts](./core-concepts/objects.md)  
🚀 **Ready to code?** → Jump to [Quick Start](./quick-start.md)

## Need Help?

- 📖 Check our [FAQ](./faq.md)
- 💬 Join the [Community Forum](https://community.logitech.com/developers)
- 📧 Contact [Developer Support](./support.md)

---

*Estimated completion time: 5 minutes*