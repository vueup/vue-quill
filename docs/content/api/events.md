# Events 

## @textChange

- **Arguments:** `{ delta: Delta, oldContents: Delta, source: EmitterSource }`

  Triggered when the text changes

## @selectionChange

- **Arguments:** `{ range: Range, oldRange: Range, source: EmitterSource }`

  Triggered when the selections changes

## @editorChange

- **Arguments:** 
  
  - `{ name: 'text-change', delta: Delta, oldContents: Delta, source: EmitterSource }`
   
    **OR**

  - `{ name: 'selection-change', range: Range, oldRange: Range, source: EmitterSource }`

  Triggered when the editor changes, either `text-change` or `selection-change`

## @update:content

- **Arguments:** `content: Delta`

  Triggered when the editor content changes

## @focus

- **Arguments:** `editor: Ref<Element>`

  Triggered when the editor gains focus.

## @blur

- **Arguments:** `editor: Ref<Element>`
  
  Triggered when the editor loses focus.

## @ready

- **Arguments:** `quill: Quill`
  
  Triggered after `Quill` initialization.
