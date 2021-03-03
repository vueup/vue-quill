import { createApp } from "vue"
import App from "./App.vue"

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import "./index.css"

// import QuillEditor from "@vueup/quill" // when use npm
import VueUpQuill from "../../src/main"

createApp(App)
  .use(VueUpQuill)
  .mount("#app")
