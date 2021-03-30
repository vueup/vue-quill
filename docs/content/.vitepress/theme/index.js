import Theme from 'vitepress/theme'
import GoogleAnalytics from '../../../components/GoogleAnalytics.vue'
import { defineAsyncComponent, h } from 'vue'
// import sponsors from './sponsors.json'

import '@tailwindcss/custom-forms/dist/custom-forms.min.css'
import '@vueup/vue-quill/dist/vue-quill.core.css' // import styles
import '@vueup/vue-quill/dist/vue-quill.bubble.css' // for bubble theme
import '@vueup/vue-quill/dist/vue-quill.snow.css' // for snow theme

const QuillEditor = defineAsyncComponent({
  loader: () =>
    process.env.NODE_ENV === 'production'
      ? import('@vueup/vue-quill').then((VueQuill) => VueQuill.QuillEditor)
      : import('../../../../packages/vue-quill/src/index').then(
          (VueQuill) => VueQuill.QuillEditor
        ),
})

import './base.css'
import './tailwind.css'
import './sponsors.css'
import './custom.css'

export default {
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component('QuillEditor', QuillEditor)
  },
  GoogleAnalytics,
  // NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      // 'sidebar-bottom': () =>
      //   h('div', { class: 'sponsors' }, [
      //     h(
      //       'a',
      //       {
      //         href: 'https://github.com/sponsors/yyx990803',
      //         target: '_blank',
      //         rel: 'noopener'
      //       },
      //       [h('span', 'Sponsors')]
      //     ),
      //     ...sponsors.map(({ href, src, name }) =>
      //       h(
      //         'a',
      //         {
      //           href,
      //           target: '_blank',
      //           rel: 'noopener',
      //           'aria-label': 'sponsor-img'
      //         },
      //         [h('img', { src: `/vue-quill/${src}`, alt: name })]
      //       )
      //     )
      //   ])
    })
  },
}
