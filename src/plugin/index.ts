
/*
* Vue-Quill-Editor index.js
* Author: surmon@foxmail.com
* Github: https://github.com/surmon-china/vue-quill-editor
*/

import VueQuill from "./VueQuill.vue"
import { App } from "vue"
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

export default {
  install: (app: App<Element>, globalOptions: object) => {
    if (globalOptions) {
      VueQuill.props.globalOptions.default = () => globalOptions
    }
    app.component(VueQuill.name, VueQuill)
  },
  VueQuill
}
