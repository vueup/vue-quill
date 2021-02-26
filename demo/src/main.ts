import { createApp } from "vue"
import App from "./App.vue"
import "./style.css"

// import QuillEditor from "@vueup/quill" // when use npm
import QuillEditor from "../../src/main"

createApp(App)
  .use(QuillEditor)
  .mount("#app")
