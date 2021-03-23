# Export

`QuillEditor` : The only component exposed.

`Quill` : The `Quill` namespace on which you can call `register`.

~~~ js 
export { QuillEditor, Quill }
export default QuillEditor
~~~

# Import

~~~ javascript
// ES6
import QuillEditor from '@vueup/vue-quill';
import { QuillEditor, Quill } from '@vueup/vue-quill';

// CommonJS
const QuillEditor = require('@vueup/vue-quill').default;
const { QuillEditor, Quill } = require('@vueup/vue-quill');
~~~

