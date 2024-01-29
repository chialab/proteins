import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'Proteins',
    description: 'A primer for JavaScript libraries and frameworks development.',
    base: '/proteins/',
    outDir: '../public',

    head: [['link', { rel: 'icon', href: 'https://www.chialab.it/favicon.png' }]],

    themeConfig: {
        logo: 'https://raw.githubusercontent.com/chialab/proteins/main/logo.svg',

        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {
                text: 'Home',
                link: '/',
            },
            {
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: 'Chialab.io',
                link: 'https://www.chialab.io',
            },
        ],

        sidebar: [
            {
                text: 'Guide',
                items: [
                    { text: 'Getting started', link: '/guide/' },
                    { text: 'Object utilities', link: '/guide/object-utilities' },
                    { text: 'Class helpers', link: '/guide/class-helpers' },
                    { text: 'EventManager', link: '/guide/event-manager' },
                    { text: 'Observable', link: '/guide/observable' },
                    { text: 'Symbol', link: '/guide/symbol' },
                    { text: 'Type utilities', link: '/guide/type-utilities' },
                ],
            },
        ],

        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/chialab/proteins',
            },
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2023 - Chialab',
        },
    },
    lastUpdated: true,
});
