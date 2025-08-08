import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Develop with Logitech',
  tagline: 'SDKs and tools for Logitech gaming peripherals',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://fitzer1982.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/LogiDoc/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'fitzer1982', // Usually your GitHub org/user name.
  projectName: 'LogiDoc', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove edit links for now
          editUrl: undefined,
          // Configure sidebar routing
          routeBasePath: 'docs',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Remove edit links for now
          editUrl: undefined,
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '',
      logo: {
        alt: 'Logitech Logo',
        src: 'img/logitech-logo.svg',
      },
      items: [
        {
          label: 'SDK 1.0',
          to: '/LogiDoc/docs/actions-sdk/'
        },
        {
          label: 'SDK 2.0',
          to: '/LogiDoc/docs/sdk2/getting-started'
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'SDKs',
          items: [
            {
              label: 'Logitech Actions SDK',
              to: '/docs/actions-sdk/intro',
            },
            {
              label: 'LightSync SDK',
              to: '/docs/lightsync-sdk/intro',
            },
            {
              label: 'Steering Wheel SDK',
              to: '/docs/steering-wheel/intro',
            },
            {
              label: 'GamePanel SDK',
              to: '/docs/gamepanel/intro',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Downloads',
              to: '/docs/wheel-download/intro',
            },
            {
              label: 'LED Illumination',
              to: '/docs/led-illumination/intro',
            },
          ],
        },
        {
          title: 'Logitech',
          items: [
            {
              label: 'Website',
              href: 'https://www.logitech.com',
            },
            {
              label: 'Gaming',
              href: 'https://www.logitechg.com',
            },
            {
              label: 'Support',
              href: 'https://support.logi.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Logitech. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
