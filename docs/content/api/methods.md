# Editor Methods

The `Editor` class wraps Quill with a modern API. Access it via component ref or the `useEditor` composable.

## Content Methods

### getHTML()

Returns content as HTML string.

```ts
const html = editor.getHTML()
// '<p>Hello <strong>World</strong></p>'
```

### getText()

Returns content as plain text.

```ts
const text = editor.getText()
// 'Hello World\n'
```

### getJSON()

Returns content as Quill Delta object.

```ts
const delta = editor.getJSON()
// { ops: [{ insert: 'Hello World\n' }] }
```

### setContent(content, source?)

Sets editor content. Content type is auto-detected.

```ts
// Set HTML
editor.setContent('<p>New content</p>')

// Set Delta
editor.setContent({ ops: [{ insert: 'Text\n' }] })

// Set plain text
editor.setContent('Plain text')

// With source (default: 'api')
editor.setContent('<p>New</p>', 'user')
```

### insertText(text, index?, source?)

Inserts text at specified position (default: current cursor).

```ts
// Insert at cursor
editor.insertText('Hello')

// Insert at position
editor.insertText('World', 5)
```

### insertContent(content, index?)

Inserts Delta or HTML content.

```ts
editor.insertContent('<strong>Bold</strong>')
editor.insertContent({ ops: [{ insert: 'Text' }] }, 0)
```

### deleteContent(index, length, source?)

Deletes content from specified position.

```ts
editor.deleteContent(0, 5) // Delete first 5 characters
```

### getLength()

Returns content length (including trailing newline).

```ts
const length = editor.getLength() // e.g., 12
```

## Selection Methods

### getSelection(focus?)

Returns current selection range.

```ts
const range = editor.getSelection()
// { index: 0, length: 5 } or null
```

### setSelection(index, length?, source?)

Sets selection/cursor position.

```ts
// Set cursor position
editor.setSelection(5)

// Set selection range
editor.setSelection(0, 10)

// From Range object
editor.setSelection({ index: 0, length: 5 })
```

## Formatting Methods

### format(name, value, source?)

Applies format at current selection.

```ts
editor.format('bold', true)
editor.format('color', '#ff0000')
editor.format('link', 'https://example.com')
```

### formatText(index, length, format, value, source?)

Formats text in range.

```ts
editor.formatText(0, 5, 'bold', true)
editor.formatText(0, 10, 'color', '#ff0000')
```

### removeFormat(index, length, source?)

Removes all formatting from range.

```ts
editor.removeFormat(0, 10)
```

### getFormat(index?, length?)

Gets format at position or selection.

```ts
const format = editor.getFormat()
// { bold: true, italic: false }
```

## Focus Methods

### focus()

Focuses the editor.

```ts
editor.focus()
```

### blur()

Removes focus from editor.

```ts
editor.blur()
```

### hasFocus()

Returns whether editor is focused.

```ts
if (editor.hasFocus()) {
  // Editor is focused
}
```

## State Methods

### setEditable(editable)

Enables or disables editing.

```ts
editor.setEditable(false) // Read-only
editor.setEditable(true)  // Editable
```

### isEditable()

Returns whether editor is editable.

```ts
if (editor.isEditable()) {
  // Can edit
}
```

### isDestroyed()

Returns whether editor has been destroyed.

```ts
if (!editor.isDestroyed()) {
  // Safe to use
}
```

## Command Chain

### chain()

Creates a chainable command sequence.

```ts
editor.chain()
  .focus()
  .insertText('Hello ')
  .format('bold', true)
  .insertText('World')
  .format('bold', false)
  .blur()
  .run()
```

**Available chain methods:**
- `focus()` - Focus editor
- `blur()` - Blur editor
- `insertText(text)` - Insert text
- `insertContent(content)` - Insert Delta/HTML
- `deleteContent(index, length)` - Delete content
- `setContent(content)` - Replace all content
- `format(name, value)` - Apply format
- `setSelection(index, length?)` - Set selection
- `run()` - Execute the chain

### can()

Check if commands can be executed.

```ts
if (editor.can().format('bold', true)) {
  // Bold formatting is available
}

if (editor.can().insertText('Hello')) {
  // Can insert text
}
```

## Lifecycle Methods

### destroy()

Destroys the editor instance and cleans up.

```ts
editor.destroy()
```

> Note: This is called automatically when using the component or composable.

## Properties

### quill

Direct access to the underlying Quill instance.

```ts
const quill = editor.quill
quill.scrollIntoView() // Use Quill methods directly
```

### element

The DOM element containing the editor.

```ts
const el = editor.element
el.classList.add('custom-class')
```

## Event Methods

### on(event, handler)

Subscribes to editor events.

```ts
editor.on('update', ({ delta }) => {
  console.log('Content changed', delta)
})
```

### off(event, handler?)

Unsubscribes from events.

```ts
editor.off('update', myHandler)
editor.off('update') // Remove all update handlers
```
