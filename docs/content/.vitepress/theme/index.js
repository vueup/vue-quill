import Theme from 'vitepress/theme'
import { defineAsyncComponent, h } from 'vue'
import sponsors from './sponsors.json'
import './base.css'
import './tailwind.css'
import './sponsors.css'
import './custom.css'

import "@tailwindcss/custom-forms/dist/custom-forms.min.css";
import "@vueup/quill/dist/quill.core.css"; // import styles
import "@vueup/quill/dist/quill.bubble.css"; // for bubble theme
import "@vueup/quill/dist/quill.snow.css"; // for snow theme

const QuillEditor = defineAsyncComponent({
  loader: () => {
    if (process.env.NODE_ENV === "production") {
      return import("@vueup/quill")
    }
    //#if process.env.NODE_ENV === "development"
    return import("../../../../src/main")
    //#endif
  }
})

export default {
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.component("QuillEditor", QuillEditor)
  },
  // NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'sidebar-bottom': () =>
        h('div', { class: 'sponsors' }, [
          h(
            'a',
            {
              href: 'https://github.com/sponsors/yyx990803',
              target: '_blank',
              rel: 'noopener'
            },
            [h('span', 'Sponsors')]
          ),
          ...sponsors.map(({ href, src, name }) =>
            h(
              'a',
              {
                href,
                target: '_blank',
                rel: 'noopener',
                'aria-label': 'sponsor-img'
              },
              [h('img', { src: `/vueup-quill/${src}`, alt: name })]
            )
          )
        ])
    })
  }
}