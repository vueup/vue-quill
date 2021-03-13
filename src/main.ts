/*
* VueUpQuill main.ts
* Author: luthfimasruri@gmail.com
* Github: https://github.com/vueup/vueup-quill.git
*/

import QuillEditor from "./components/QuillEditor"
import Quill from "quill"
import { App } from "vue"

// Declare install function executed by Vue.use()
const install = (app: App<Element>, globalOptions: object) => {
  if (globalOptions) {
    QuillEditor.props.globalOptions.default = () => globalOptions
  }
  app.component(QuillEditor.name, QuillEditor)
}

export { install as default, QuillEditor, Quill };