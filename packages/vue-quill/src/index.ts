/*
 * VueQuill index.ts
 * Author: luthfimasruri@gmail.com
 * Github: https://github.com/vueup/vue-quill.git
 * License: MIT
 */

import Delta from 'quill-delta'
import { QuillEditor } from './components/QuillEditor'
import { Quill, loadQuill, getLoadedQuill } from './quill'
export type { QuillConstructor } from './quill'
export { QuillEditor, Quill, Delta, loadQuill, getLoadedQuill }
