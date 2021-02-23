
/*
* Vue-Quill-Editor index.js
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-quill-editor
*/

import QuillEditor from "./QuillEditor.vue"
import { App } from "vue"
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

export default {
  install: (app: App<Element>, globalOptions: object) => {
    if (globalOptions) {
      QuillEditor.props.globalOptions.default = () => globalOptions
    }
    app.component(QuillEditor.name, QuillEditor)
  },
  QuillEditor
}
