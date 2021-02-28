/*
* VueUpQuill main.ts
* Author: luthfimasruri@gmail.com
* Github: https://github.com/vueup/vueup-quill.git
*/

import QuillEditor from "./QuillEditor.vue"
import Quill from "quill"
import { App } from "vue"

const install = (app: App<Element>, globalOptions: object) => {
  if (globalOptions) {
    QuillEditor.props.globalOptions.default = () => globalOptions
  }
  app.component(QuillEditor.name, QuillEditor)
}

export { install as default, Quill, QuillEditor }
