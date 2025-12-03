# Events 

## @textChange

- **Arguments:** `{ delta: Delta, oldContents: Delta, source: Sources }`

  Triggered when the text changes

## @selectionChange

- **Arguments:** `{ range: RangeStatic, oldRange: RangeStatic, source: Sources }`

  Triggered when the selections changes

## @editorChange

- **Arguments:** 
  
  - `{ name: 'text-change', delta: Delta, oldContents: Delta, source: Sources}`
   
    **OR**

  - `{ name: 'selection-change', range: RangeStatic, oldRange: RangeStatic, source: Sources }`

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
