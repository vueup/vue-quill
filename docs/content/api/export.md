# Export

`QuillEditor` : The Quill Editor Component.

`Quill` : The `Quill` namespace on which you can call `register`. In SSR
applications, access other Quill APIs after the browser loads Quill.

`loadQuill` : Loads the Quill browser runtime asynchronously. Use this from
browser-only lifecycle hooks such as `onMounted`.

`getLoadedQuill` : Returns the loaded Quill runtime when it is already
available.

```js
export { QuillEditor, Quill, loadQuill, getLoadedQuill }
```

# Import

```javascript
// ES6
import { QuillEditor, Quill, loadQuill } from '@vueup/vue-quill'

// CommonJS
const { QuillEditor, Quill, loadQuill } = require('@vueup/vue-quill')
```
