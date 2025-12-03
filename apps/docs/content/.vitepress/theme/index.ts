import { h, defineAsyncComponent } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeDemo from './components/HomeDemo.vue'
import Loading from './components/Loading.vue'

import './styles/tailwind.css'
import './styles/vars.css'

const QuillEditor = defineAsyncComponent({
  loader: () => import('@vueup/vue-quill').then((mod) => mod.QuillEditor),
  loadingComponent: Loading,
})

import '@vueup/vue-quill/dist/vue-quill.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(HomeDemo),
    })
  },
  enhanceApp({ app }) {
    app.component('QuillEditor', QuillEditor)
  },
} satisfies Theme
