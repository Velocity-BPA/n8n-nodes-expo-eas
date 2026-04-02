# n8n-nodes-expo-eas

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A powerful n8n community node that provides comprehensive integration with Expo Application Services (EAS). This node includes 5 resources with full CRUD operations, enabling you to automate React Native app builds, over-the-air updates, app store submissions, project management, and webhook configurations directly from your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React Native](https://img.shields.io/badge/React%20Native-Expo-purple)
![EAS](https://img.shields.io/badge/EAS-Supported-green)
![Mobile CI/CD](https://img.shields.io/badge/Mobile-CI%2FCD-orange)

## Features

- **Build Automation** - Trigger and monitor iOS/Android builds with custom configurations
- **OTA Updates** - Deploy over-the-air updates to published apps instantly
- **App Store Submissions** - Automate submissions to Apple App Store and Google Play Store
- **Project Management** - Manage Expo projects, configurations, and team settings
- **Webhook Integration** - Configure and manage EAS webhooks for real-time notifications
- **Build Status Monitoring** - Track build progress and receive completion notifications
- **Multi-Platform Support** - Handle iOS and Android workflows in unified automation
- **Team Collaboration** - Manage team access and permissions across projects

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-expo-eas`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-expo-eas
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-expo-eas.git
cd n8n-nodes-expo-eas
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-expo-eas
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Expo access token from expo.dev/accounts/[account]/settings | Yes |
| Account Name | Your Expo account username or organization name | Yes |
| Base URL | EAS API base URL (defaults to https://api.expo.dev) | No |

## Resources & Operations

### 1. Build

| Operation | Description |
|-----------|-------------|
| Create | Trigger a new EAS build for iOS or Android |
| Get | Retrieve build details and status by build ID |
| List | Get all builds for a project with filtering options |
| Cancel | Cancel a running or queued build |
| Retry | Retry a failed build with same configuration |

### 2. Update

| Operation | Description |
|-----------|-------------|
| Create | Publish a new over-the-air update |
| Get | Retrieve update details by update ID |
| List | Get all updates for a project or branch |
| Delete | Delete an existing update |
| Get Stats | Retrieve download statistics for updates |

### 3. Submission

| Operation | Description |
|-----------|-------------|
| Create | Submit app to Apple App Store or Google Play |
| Get | Retrieve submission status and details |
| List | Get all submissions for a project |
| Cancel | Cancel a pending submission |
| Resubmit | Resubmit a failed or rejected submission |

### 4. Project

| Operation | Description |
|-----------|-------------|
| Get | Retrieve project configuration and details |
| Update | Update project settings and configuration |
| List | Get all projects for an account |
| Create | Create a new Expo project |
| Delete | Delete an existing project |

### 5. Webhook

| Operation | Description |
|-----------|-------------|
| Create | Create a new webhook endpoint |
| Get | Retrieve webhook configuration |
| List | Get all webhooks for a project |
| Update | Update webhook URL or event subscriptions |
| Delete | Delete an existing webhook |

## Usage Examples

```javascript
// Trigger iOS and Android builds
const buildWorkflow = {
  "ios_build": {
    "platform": "ios",
    "profile": "production",
    "gitCommitHash": "main"
  },
  "android_build": {
    "platform": "android", 
    "profile": "production",
    "gitCommitHash": "main"
  }
};
```

```javascript
// Deploy OTA update to production
const otaUpdate = {
  "branchName": "production",
  "message": "Fix critical bug in payment flow",
  "runtimeVersion": "1.0.0",
  "platform": "all"
};
```

```javascript
// Submit to app stores after successful build
const submission = {
  "platform": "ios",
  "buildId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "submissionConfig": {
    "releaseType": "MANUAL",
    "idfa": false
  }
};
```

```javascript
// Monitor builds with webhook
const webhook = {
  "url": "https://api.myapp.com/webhooks/expo",
  "secret": "webhook_secret_key",
  "events": ["BUILD_COMPLETE", "SUBMISSION_COMPLETE"]
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid API key or expired token | Verify API key in Expo dashboard settings |
| Build Failed | Build compilation errors or configuration issues | Check build logs and project configuration |
| Insufficient Credits | EAS build credits exhausted | Add build credits to your Expo account |
| Invalid Platform | Unsupported platform specified | Use 'ios', 'android', or 'all' |
| Project Not Found | Project doesn't exist or access denied | Verify project name and permissions |
| Rate Limited | Too many API requests | Implement exponential backoff retry logic |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-expo-eas/issues)
- **EAS Documentation**: [Expo Application Services](https://docs.expo.dev/eas/)
- **Expo Community**: [Expo Discord](https://discord.gg/expo)