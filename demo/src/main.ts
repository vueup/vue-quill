import { createApp } from "vue"
import App from "./App.vue"

// import QuillEditor from "vue3-quill-editor" // when use npm
import QuillEditor from "../../src/main"

createApp(App)
  .use(QuillEditor)
  .mount("#app")
