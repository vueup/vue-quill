import Theme from 'vitepress/theme'
import { h } from 'vue'
import sponsors from './sponsors.json'
import './tailwind.css'
import './sponsors.css'
import './custom.css'

import VueUpQuill from "../../../src/main";
import "quill/dist/quill.core.css"; // import styles
import 'quill/dist/quill.snow.css' // for snow theme
// import "../../../src/themes/quill.snow2.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

export default {
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
              [h('img', { src, alt: name })]
            )
          )
        ])
    })
  },
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    app.use(VueUpQuill)
  },
  // NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
}