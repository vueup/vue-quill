import { QuillOptionsStatic, StringMap } from "quill"

const defaultToolbar: QuillOptionsStatic = {
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, 'clean'],
      [{ 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
    ]
  }
}
const minimalToolbar: QuillOptionsStatic = {
  modules: {
    toolbar: [
      [{ 'header': 1 }, { 'header': 2 }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
    ]
  }
}
const fullToolbar: QuillOptionsStatic = {
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

export const toolbar = {
  default: defaultToolbar,
  minimal: minimalToolbar,
  full: fullToolbar,
}