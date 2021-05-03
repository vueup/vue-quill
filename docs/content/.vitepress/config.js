// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  base: '/vue-quill/',
  lang: 'en-US',
  title: 'VueQuill',
  description: 'Rich Text Editor Component for Vue 3.',
  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/vue-quill/logo.svg' },
    ],
  ],
  themeConfig: {
    repo: 'vueup/vue-quill',
    logo: '/logo.svg',
    docsDir: 'docs/content',
    docsBranch: 'beta',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    algolia: {
      apiKey: '05a276b73b9dd064f0788b9669751f46',
      indexName: 'vue-quill',
    },

    // carbonAds: {
    //   carbon: 'CEBIEK3N',
    //   placement: 'vuequilldev'
    // },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
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
      '/config/': 'auto',
      '/plugins': 'auto',
      // catch-all fallback
      '/': [
        {
          text: 'Guide',
          children: [
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
          children: [
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
}
