import { h } from 'vue'
import Theme from 'vitepress/theme'
import HomeDemo from './components/HomeDemo.vue'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.core.css' // import styles
import '@vueup/vue-quill/dist/vue-quill.bubble.css' // for bubble theme
import '@vueup/vue-quill/dist/vue-quill.snow.css' // for snow theme

import './styles/tailwind.css'
import './styles/vars.css'
// import './styles/custom.css'

export default {
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component('QuillEditor', QuillEditor)
  },
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomeDemo),
      // 'aside-ads-before': () => h(AsideSponsors)
    })
  },
}
