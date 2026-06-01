declare module '@vueup/vue-quill' {
  import {
    Delta as LocalDelta,
    Quill as LocalQuill,
    QuillEditor as LocalQuillEditor,
  } from '../../../packages/vue-quill/src/index'

  export type Delta = InstanceType<typeof LocalDelta>
  export const Delta: typeof LocalDelta
  export const Quill: typeof LocalQuill
  export const QuillEditor: typeof LocalQuillEditor
}
