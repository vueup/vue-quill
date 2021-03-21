// @ts-check

/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  base: '/vue-quill/',
  lang: 'en-US',
  title: 'VueQuill',
  description: 'Vue 3 + Quill Component for your powerful text editor. ',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/vue-quill/logo.svg' }]],
  themeConfig: {
    repo: 'vueup/vue-quill',
    logo: '/logo.svg',
    docsDir: 'docs/content',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Suggest changes to this page',

    // algolia: {
    //   apiKey: 'b573aa848fd57fb47d693b531297403c',
    //   indexName: 'vitejs'
    // },

    // carbonAds: {
    //   carbon: 'CEBIEK3N',
    //   placement: 'vitejsdev'
    // },

    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API Reference', link: '/api/' },
      // { text: 'Config', link: '/config/' },
      // { text: 'Plugins', link: '/plugins/' },
      // {
      //   text: 'Links',
      //   items: [
      //     {
      //       text: 'Twitter',
      //       link: 'https://twitter.com/vite_js'
      //     },
      //     {
      //       text: 'Discord Chat',
      //       link: 'https://chat.vitejs.dev'
      //     },
      //     {
      //       text: 'Awesome Vite',
      //       link: 'https://github.com/vitejs/awesome-vite'
      //     },
      //     {
      //       text: 'DEV Community',
      //       link: 'https://dev.to/t/vite'
      //     },
      //     {
      //       text: 'Rollup Plugins Compat',
      //       link: 'https://vite-rollup-plugins.patak.dev/'
      //     },
      //     {
      //       text: 'Changelog',
      //       link:
      //         'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
      //     }
      //   ]
      // }
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
              link: '/guide/'
            },
            {
              text: 'Installation',
              link: '/guide/installation'
            },
            {
              text: 'Usage',
              link: '/guide/usage'
            },
            {
              text: 'Themes',
              link: '/guide/themes'
            },
            {
              text: 'Toolbar',
              link: '/guide/toolbar'
            },
            {
              text: 'Options',
              link: '/guide/options'
            },
          ]
        },
        {
          text: 'APIs',
          children: [
            {
              text: 'Props',
              link: '/api/'
            },
            {
              text: 'Events',
              link: '/api/events'
            },
            {
              text: 'Methods',
              link: '/api/methods'
            },
            {
              text: 'Slots',
              link: '/api/slots'
            },
            {
              text: 'Export',
              link: '/api/export'
            },
          ]
        }
      ]
    }
  }
}
