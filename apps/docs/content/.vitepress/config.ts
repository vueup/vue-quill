import 'dotenv/config'
import { defineConfig } from 'vitepress'

const ogDescription = 'VueQuill Rich Text Editor for Vue 3'
const ogImage = 'https://vueup.github.io/vue-quill/og-image.png'
const ogTitle = 'VueQuill'
const ogUrl = 'https://vueup.github.io/vue-quill/'

export default defineConfig({
  base: '/vue-quill/',
  lang: 'en-US',
  title: 'VueQuill',
  description: 'Rich Text Editor Component for Vue 3.',
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/vue-quill/logo.svg' },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'theme-color', content: '#6279f4' }],
  ],
  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern:
        'https://github.com/vueup/vue-quill/edit/beta/docs/content/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vueup/vue-quill' },
    ],

    algolia: {
      appId: process.env.ALGOLIA_APP_ID as string,
      apiKey: process.env.ALGOLIA_SEARCH_KEY as string,
      indexName: 'vue-quill',
      searchParameters: {},
    },

    // carbonAds: {
    //   carbon: 'CEBIEK3N',
    //   placement: 'vuequilldev'
    // },

    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2020-present Luthfi Masruri & VueQuill Contributors',
    },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      {
        text: 'Support VueQuill',
        items: [
          {
            text: 'Patreon',
            link: 'https://www.patreon.com/luthfimasruri',
          },
          {
            text: 'Buy me a coffee',
            link: 'https://www.buymeacoffee.com/luthfimasruri',
          },
        ],
      },
    ],

    sidebar: {
      // '/config/': 'auto',
      // '/plugins': 'auto',
      // catch-all fallback
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Introduction',
              link: '/guide/',
            },
            {
              text: 'Installation',
              link: '/guide/installation',
            },
            {
              text: 'Usage',
              link: '/guide/usage',
            },
            {
              text: 'Themes',
              link: '/guide/themes',
            },
            {
              text: 'Toolbar',
              link: '/guide/toolbar',
            },
            {
              text: 'Modules',
              link: '/guide/modules',
            },
            {
              text: 'Options',
              link: '/guide/options',
            },
          ],
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'Props',
              link: '/api/',
            },
            {
              text: 'Events',
              link: '/api/events',
            },
            {
              text: 'Methods',
              link: '/api/methods',
            },
            {
              text: 'Slots',
              link: '/api/slots',
            },
            {
              text: 'Export',
              link: '/api/export',
            },
          ],
        },
      ],
    },
  },
})
