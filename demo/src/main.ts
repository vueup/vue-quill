import { createApp } from "vue"
import App from "./App.vue"
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme
import "./style.css"

// import QuillEditor from "@vueup/quill" // when use npm
import QuillEditor from "../../src/main"

createApp(App)
  .use(QuillEditor)
  .mount("#app")
