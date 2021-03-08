import Theme from 'vitepress/theme'
import { h } from 'vue'
import sponsors from './sponsors.json'
import './tailwind.css'
import './sponsors.css'
import './custom.css'

// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;

// const dom = new JSDOM('<div id="editor"></div>');

// dom.window.document.getSelection = function () { return { getRangeAt: function () { } }; };
// dom.window.document.execCommand = function (command, showUI, value) { try { return document.execCommand(command, showUI, value); } catch (e) { } return false; };

// global.window = dom.window;
// global.document = dom.window.document;
// global.Node = dom.window.Node;
// global.navigator = global.window.navigator;
// global.Text = dom.window.Text;
// global.HTMLElement = window.HTMLElement;
// global.MutationObserver = dom.window.MutationObserver;


// let VueUpQuill

// if (process.browser) {
// let { QuillEditor } = require('../../../dist/quill.cjs')
// const VueUpQuill = typeof window === 'object' ? require('../../../src/main').default : () => false;
// const VueUpQuill = typeof window === 'object' ? require('../../../dist/quill.cjs.js').default : () => false;

// let VueUpQuill = require('../../../src/main').default
// let VueUpQuill = require('../../../dist/quill.cjs').default
// } else {
//   // VueUpQuill = require('vue-quill-editor/dist/ssr')
// }

// import { QuillEditor } from '../../../dist/quill.es'
// import VueUpQuill from '../../../src/main'

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
    // app.component("QuillEditor", QuillEditor)
    // app.use(VueUpQuill)
  },
  // NotFound: () => 'custom 404', // <- this is a Vue 3 functional component
}