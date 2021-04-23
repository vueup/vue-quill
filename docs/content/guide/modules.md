# Modules
Modules allow Quill’s behavior and functionality to be customized. To enable a module, simply include it in a  [`modules` prop](../api/index.md#modules).

## Example

In this example I am gonna use [quill-blot-formatter](https://github.com/Fandom-OSS/quill-blot-formatter), a module for resizing and realigning images and iframe video.

**Installation:**

``` bash
npm install --save quill-blot-formatter
# OR
yarn add quill-blot-formatter
```

**Usage:**

~~~ vue
<template>
  <QuillEditor :modules="modules" toolbar="full" />
</template>

<script>
import { ref, defineComponent } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import BlotFormatter from 'quill-blot-formatter'
import '@vueup/vue-quill/../dist/vue-quill.snow.css'

export default defineComponent({
  components: {
    QuillEditor,
  },
  setup: () => {
    const modules = {
      name: 'blotFormatter',  
      module: BlotFormatter, 
      options: {/* options */}
    }
    return { modules }
  },
})
</script>
~~~

See [Quill modules docs](https://quilljs.com/docs/modules/) for more details.

## Quill Modules

- [quill-autoformat](https://github.com/weavy/quill-autoformat) - Module for transforming text including mentions, links and hashtags
- [quill-better-table](https://github.com/soccerloway/quill-better-table) - A module for table editting, support resizing column, multiline cell, merging/unmerging cells
- [quill-blot-formatter](https://github.com/Fandom-OSS/quill-blot-formatter) - A module for resizing and realigning images and iframe videos
- [quill-cursors](https://github.com/reedsy/quill-cursors) - A multi cursor module for Quill text editor
- [quill-emoji](https://github.com/contentco/quill-emoji) - Quill module toolbar extension for emoji
- [quill-focus](https://amka.github.io/quill-focus/) - A Quill.js module that adds "focus mode"
- [quill-form](https://github.com/weavy/quill-form) - Module for automatic form input and submit binding
- [quill-find-replace-module](https://github.com/MuhammedAlkhudiry/quill-find-replace-module) - A module for Quill.js for finding words and replacing them
- [quill-html-edit-button](https://github.com/benwinding/quill-html-edit-button) - A module to add a button which allows you to view/edit the raw HTML in the quill editor.
- [quill-image-compress](https://github.com/benwinding/quill-image-compress) - A module to compress images before adding them to the editor.
- [quill-image-drop-module](https://github.com/kensnyder/quill-image-drop-module) - A module to allow images to be pasted and drag/dropped into the editor
- [quill-image-resize-module](https://github.com/kensnyder/quill-image-resize-module) - A module to allow images to be resized (not maintained: use quill-blot-formatter instead)
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