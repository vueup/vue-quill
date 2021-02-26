import { SourceMap } from "module"
import { QuillOptionsStatic, StringMap } from "quill"

const defaultEvents = [
  "text-change",
  "selection-change",
  "editor-change"
]

const customEvents = [
  "update:content",
  "focus",
  "blur",
  "ready"
]

const defaultOptions: QuillOptionsStatic = {
  theme: "snow",
  // boundary: document.body,
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
  },
  placeholder: "Insert text here ...",
  readOnly: false,
}
const minimalOptions: QuillOptionsStatic = {}
const bubbleOptions: QuillOptionsStatic | StringMap = {
  theme: "bubble",
  boundary: document.body
}
const snowOptions: QuillOptionsStatic = {
  theme: "snow",
}

export default {
  events: [...defaultEvents, ...customEvents],
  options: {
    none: {},
    default: defaultOptions,
    minimal: minimalOptions,
    bubble: bubbleOptions,
    snow: snowOptions
  }
}