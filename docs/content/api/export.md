# Export

`QuillEditor` : The only component exposed.

`Quill` : The `Quill` namespace on which you can call `register`.

~~~ js 
export {
  QuillEditor as default,
  QuillEditor,
  Quill
};
~~~

# Import

~~~ javascript
// ES6
import QuillEditor from '@vueup/quill';
import { QuillEditor, Quill } from '@vueup/quill';

// CommonJS
const QuillEditor = require('@vueup/quill').default;
const { QuillEditor, Quill } = require('@vueup/quill');
~~~

