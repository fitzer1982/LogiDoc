import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  actionsSdkSidebar: [
    'actions-sdk/index',
    'actions-sdk/overview',
    'actions-sdk/getting-started',
    'actions-sdk/installation',
    'actions-sdk/authentication',
    'actions-sdk/quick-start',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'actions-sdk/core-concepts/objects',
        'actions-sdk/core-concepts/webhooks',
        'actions-sdk/core-concepts/rate-limits',
      ],
    },
    'actions-sdk/api-reference',
    {
      type: 'category',
      label: 'Guides & Tutorials',
      items: [
        'actions-sdk/guides/payment-intents',
        'actions-sdk/guides/save-cards',
        'actions-sdk/guides/webhooks-guide',
      ],
    },
    'actions-sdk/samples',
    'actions-sdk/error-handling',
    'actions-sdk/release-notes',
    'actions-sdk/faq',
    'actions-sdk/support',
    {
      type: 'category',
      label: 'Plugin Development (Hidden)',
      collapsible: true,
      collapsed: true,
      items: [
        'actions-sdk/plugin-development/marketplace-approval-guidelines'
      ]
    },
    'actions-sdk/plugin-development/marketplace-approval-guidelines',
  ],
  sdk2Sidebar: [
    {
      type: 'category',
      label: 'Introduction',
      collapsible: false,
      items: [
        'sdk2/getting-started',
        'sdk2/your-first-changes',
        'sdk2/plugin-environment',
      ],
    },
    {
      type: 'category',
      label: 'Plugin Guides',
      collapsible: false,
      items: [
        'sdk2/actions',
        'sdk2/keys',
        'sdk2/dials',
        'sdk2/settings',
        'sdk2/property-inspectors',
        'sdk2/devices',
        'sdk2/profiles',
        'sdk2/logging',
        'sdk2/deep-linking',
        'sdk2/app-monitoring',
        'sdk2/system',
        'sdk2/localization',
        'sdk2/distribution',
      ],
    },
    {
      type: 'category',
      label: 'Style Guide',
      collapsible: false,
      items: [
        'sdk2/plugin-guidelines',
        'sdk2/code-linting',
        'sdk2/submission-guidelines',
      ],
    },
    {
      type: 'category',
      label: 'References',
      collapsible: false,
      items: [
        'sdk2/manifest',
        'sdk2/touchscreen-layout',
        'sdk2/changes',
      ],
    },
    {
      type: 'category',
      label: 'WebSocket API',
      collapsible: false,
      items: [
        'sdk2/websocket-api-plugin',
        'sdk2/websocket-api-property-inspector',
        'sdk2/websocket-api-changes',
      ],
    },
  ],
};

export default sidebars;
