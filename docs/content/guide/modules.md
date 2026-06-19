# Modules
Modules allow Quill’s behavior and functionality to be customized. To enable a module, simply include it in a  [`modules` prop](../api/index.md#modules).

## Example

This example uses [quill-blot-formatter2](https://github.com/enzedonline/quill-blot-formatter2), a Quill 2-compatible module for resizing and realigning images and iframe video.

**Installation:**

```bash
npm install --save @enzedonline/quill-blot-formatter2
# OR
yarn add @enzedonline/quill-blot-formatter2
```

**Usage:**

```vue
<template>
  <QuillEditor :modules="modules" toolbar="full" />
</template>

<script>
import { defineComponent } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import BlotFormatter from '@enzedonline/quill-blot-formatter2'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@enzedonline/quill-blot-formatter2/dist/css/quill-blot-formatter2.css'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const modules = {
      name: 'blotFormatter2',
      module: BlotFormatter, 
      options: {/* options */}
    }
    return { modules }
  },
})
</script>
```
## Example Using quill-image-uploader

This example uses [quill-image-uploader](https://github.com/NoelOConnell/quill-image-uploader), a module for uploading images to a server instead of embedding them as base64 strings.


**Installation:**
```bash
npm install quill-image-uploader --save
```
**Usage:**

```vue
<template>
  <QuillEditor :modules="modules" toolbar="full" />
</template>

<script>
import { defineComponent } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import ImageUploader from 'quill-image-uploader'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const modules = {
      name: 'imageUploader',
      module: ImageUploader,
      options: {
        upload: async (file) => {
          const formData = new FormData()
          formData.append('image', file)

          const response = await fetch('/upload-image', {
            method: 'POST',
            body: formData,
          })
          const data = await response.json()

          return data.url
        },
      },
    }

    return { modules }
  },
})
</script>
```

See [Quill modules docs](https://quilljs.com/docs/modules/) for more details.

## Registering Formats And Blots

Use a shorthand name for ordinary modules, or pass a full Quill registration path when a package exposes formats or blots that must be registered before the module.

```js
import { Mention, MentionBlot } from 'quill-mention'

const modules = [
  {
    name: 'blots/mention',
    module: MentionBlot,
  },
  {
    name: 'modules/mention',
    module: Mention,
    options: {
      mentionDenotationChars: ['@'],
      source: (searchTerm, renderList) => {
        renderList([], searchTerm)
      },
    },
  },
]
```

`modules/mention` is registered as a Quill module and its `options` are passed to Quill as `modules.mention`. `blots/mention` is registered as a Quill blot and is not added to the module options.

If you use Quill's `formats` option, include the mention blot name so Quill allows mention embeds in the editor contents:

```js
const options = {
  formats: ['bold', 'italic', 'mention'],
}
```

## Quill Modules

- [quill-autoformat](https://github.com/weavy/quill-autoformat) - Module for transforming text including mentions, links and hashtags
- [quill-better-table](https://github.com/soccerloway/quill-better-table) - A module for table editing, column resizing, multiline cells, and merging/unmerging cells
- [quill-blot-formatter2](https://github.com/enzedonline/quill-blot-formatter2) - Quill 2-compatible module for resizing and realigning images and iframe videos
- [quill-cursors](https://github.com/reedsy/quill-cursors) - A multi cursor module for Quill text editor
- [quill-emoji](https://github.com/contentco/quill-emoji) - Quill module toolbar extension for emoji
- [quill-focus](https://amka.github.io/quill-focus/) - A Quill.js module that adds "focus mode"
- [quill-form](https://github.com/weavy/quill-form) - Module for automatic form input and submit binding
- [quill-find-replace-module](https://github.com/MuhammedAlkhudiry/quill-find-replace-module) - A module for Quill.js for finding words and replacing them
- [quill-html-edit-button](https://github.com/benwinding/quill-html-edit-button) - A module to add a button which allows you to view/edit the raw HTML in the quill editor.
- [quill-image-compress](https://github.com/benwinding/quill-image-compress) - A module to compress images before adding them to the editor.
- [quill-image-drop-module](https://github.com/kensnyder/quill-image-drop-module) - A module to allow images to be pasted and drag/dropped into the editor
- [quill-image-resize-module](https://github.com/kensnyder/quill-image-resize-module) - A module to allow images to be resized (not maintained: use quill-blot-formatter2 instead)
- [quill-image-uploader](https://github.com/NoelOConnell/quill-image-uploader) - Upload image to server, adds toolbar button and handles dropped/pastes images
- [quill-image-url-drop-module](https://github.com/riencroonenborghs/quill-image-url-drop-module) - A module to allow images' URLs to be drag/dropped into the editor
- [quill-magic-url](https://github.com/visualjerk/quill-magic-url) - Checks for URLs during typing / pasting and automatically converts them to links
- [quill-markdown-shortcuts](https://github.com/patleeman/quill-markdown-shortcuts) - Quill.js module that converts markdown to rich text formatting while typing
- [quill-markdown-toolbar](https://github.com/park53kr/quill-markdown-toolbar) - A Quill.js module for converting markdown text to rich text format
- [quill-mention](https://github.com/afconsult/quill-mention) - @mentions for the Quill rich text editor
- [quill-paste-smart](https://github.com/Artem-Schander/quill-paste-smart) - Paste only supported HTML
- [quill-placeholder-module](https://github.com/jspaine/quill-placeholder-module) - A quill module for adding placeholders
- [quill-placeholder-autocomplete-module](https://github.com/Datananas/quill-placeholder-autocomplete) - brings autocomplete to "quill-placeholder-module"
- [quill-rich-voice-editor](https://github.com/fabiancelik/rich-voice-editor) - A Quill.js module for SSML tags and functions to build better voice applications
- [quill-table-ui](https://github.com/volser/quill-table-ui) - A module for table UI
