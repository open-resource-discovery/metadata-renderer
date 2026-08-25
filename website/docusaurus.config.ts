import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const LAYER_ORDER = [
    'theme',
    'base',
    'docusaurus.infima',
    'docusaurus.theme-common',
    'docusaurus.theme-classic',
    'docusaurus.core',
    'docusaurus.plugin-debug',
    'docusaurus.theme-mermaid',
    'docusaurus.theme-live-codeblock',
    'docusaurus.theme-search-algolia.docsearch',
    'docusaurus.theme-search-algolia',
    'components',
    'utilities',
].join(', ');

const config: Config = {
    title: 'Metadata Renderer',
    tagline: 'Rendering SAP Metadata with one component',
    favicon: 'img/favicon.ico',
    storage: { namespace: true },
    future: {
        v4: true,
        faster: {
            rspackBundler: true,
        },
    },
    url: 'https://open-resource-discovery.github.io',
    baseUrl: process.env.BASE_URL || '/metadata-renderer/',
    organizationName: 'ORD',
    projectName: 'metadata-renderer',
    onBrokenLinks: 'throw',
    markdown: { hooks: { onBrokenMarkdownLinks: 'ignore' } },
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
                    routeBasePath: '/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    plugins: [
        // @asyncapi/parser pulls in `avsc` etc. which reference Node builtins
        // (zlib, stream, path, fs). Stub them out so Webpack doesn't crash at
        // runtime. The renderer's source already imports the pre-built browser
        // bundle, so these builtins are never actually reached.
        function webpackFallbacks() {
            const fallback = {
                zlib: false,
                stream: false,
                path: false,
                fs: false,
                buffer: false,
                util: false,
                url: false,
                http: false,
                https: false,
                crypto: false,
                os: false,
                assert: false,
                net: false,
                tls: false,
            } as const;
            return {
                name: 'webpack-node-fallbacks',
                configureWebpack() {
                    return { resolve: { fallback } };
                },
                configureRspack() {
                    return { resolve: { fallback } };
                },
            };
        },
    ],

    headTags: [
        {
            tagName: 'style',
            attributes: {},
            innerHTML: `@layer ${LAYER_ORDER};`,
        },
    ],

    themeConfig: {
        // Replace with your project's social card
        colorMode: {
            respectPrefersColorScheme: false,
        },
        navbar: {
            title: 'Metadata Renderer',
            logo: {
                alt: 'Metadata Logo',
                src: 'img/Metadata Renderer.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    position: 'left',
                    sidebarId: 'tutorialSidebar',
                    label: 'Documentation',
                },
                {
                    to: '/playground',
                    position: 'left',
                    label: 'Playground',
                },
                {
                    href: 'https://github.com/open-resource-discovery/metadata-renderer',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
        ...(process.env.PR_PREVIEW_NUMBER
            ? {
                  announcementBar: {
                      content: `<b>This is a preview version of the website for <a href="https://github.com/open-resource-discovery/metadata-renderer/pull/${process.env.PR_PREVIEW_NUMBER}" target="_blank">PR #${process.env.PR_PREVIEW_NUMBER}</a></b>`,
                      backgroundColor: '#e65050ff',
                      textColor: '#fff',
                      isCloseable: false,
                  },
              }
            : {}),
    } satisfies Preset.ThemeConfig,
};

export default config;
