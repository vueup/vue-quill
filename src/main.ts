/*
* VueUpQuill main.ts
* Author: luthfimasruri@gmail.com
* Github: https://github.com/vueup/vueup-quill.git
*/

import QuillEditor from "./components/QuillEditor"
import _Quill from "quill"
import { App } from "vue"

const GLOBAL = ((): any =>
  typeof window !== 'undefined' ? window : global
)();
const Quill: _Quill = GLOBAL.Quill ?? _Quill

// Declare install function executed by Vue.use()
const install = (app: App<Element>, globalOptions: object) => {
  if (globalOptions) {
    QuillEditor.props.globalOptions.default = () => globalOptions
  }
  app.component(QuillEditor.name, QuillEditor)
}

const VueUpQuill = { install, QuillEditor, Quill, };
export { install, QuillEditor, Quill };
export default VueUpQuill;