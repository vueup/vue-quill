# Options

Use `options` prop or/and `globalOptions` prop to configure Quill.

## options prop

::: warning
Only use `options` prop when you register QuillEditor component locally
:::

- **Usage:**
  ``` javascript
  import QuillEditor from '@vueup/quill'
  import '@vueup/quill/dist/quill.snow.css';

  export default {
    components: {
      QuillEditor
    },
    data() {
      return { 
        options: {
          debug: 'info',
          modules: {
            toolbar: ['bold', 'italic', 'underline']
          },
          placeholder: 'Compose an epic...',
          readOnly: true,
          theme: 'snow'
        }
      }
    },
  }
  ```

- **In your template:**

  ``` vue
  <template>
    <QuillEditor :options="options" />
  </template>
  ```

## globalOptions prop

::: warning
Only use `globalOptions` prop when you register QuillEditor component globally
:::

- **Usage:**

  ``` js
  import { createApp } from 'vue'
  import QuillEditor from '@vueup/quill'

  const app = createApp()
  // define your options
  const globalOptions = {
    debug: 'info',
    modules: {
      toolbar: ['bold', 'italic', 'underline']
    },
    placeholder: 'Compose an epic...',
    readOnly: true,
    theme: 'snow'
  }
  // set default globalOptions prop
  QuillEditor.props.globalOptions.default = () => globalOptions
  // register QuillEditor component
  app.component('QuillEditor', QuillEditor)
  ```

## Option Attributes

### bounds
- **Default:** `document.body`

  DOM Element or a CSS selector for a DOM Element, within which the editor’s ui elements (i.e. tooltips, etc.) should be confined. Currently, it only considers left and right boundaries.

### debug
- **Default:** `warn`

  Shortcut for debug. Note debug is a static method and will affect other instances of Quill editors on the page. Only warning and error messages are enabled by default.

### formats
- **Default:** `All formats`

  Whitelist of formats to allow in the editor. See [Formats](https://quilljs.com/docs/formats/) for a complete list.

### modules
  Collection of modules to include and respective options. See [Modules](https://quilljs.com/docs/modules/) for more information.

### placeholder
- **Default:** `None`

  Placeholder text to show when editor is empty.

### readOnly
- **Default:** `false`

  Whether to instantiate the editor to read-only mode.

### scrollingContainer
- **Default:** `null`

  DOM Element or a CSS selector for a DOM Element, specifying which container has the scrollbars (i.e. overflow-y: auto), if is has been changed from the default ql-editor with custom CSS. Necessary to fix scroll jumping bugs when Quill is set to auto grow its height, and another ancestor container is responsible from the scrolling.

### theme
Name of theme to use. The builtin options are `bubble` or `snow`. An invalid or falsy value will load a default minimal theme. Note the theme’s specific stylesheet still needs to be included manually. See [Themes](themes.md) for more information.