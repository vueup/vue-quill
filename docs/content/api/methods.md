# Methods

::: warning
We highly recommend to call method when the quill editor ready, use @ready event
:::

## getEditor()
  
- **Return:** `editor: Element`

  Returns the Editor Element.

## getToolbar()
  
- **Return:** `toolbar: Element`

  Returns the Toolbar Element.

## getQuill()

- **Return:** `quill: Quill`

  Returns the Quill instance that backs the editor. While you can freely use this to access methods such as `getText()`, `focus()`, and much [more](https://quilljs.com/docs/api/).

## getHTML()
  
- **Return:** `html: string`

  Returns the full HTML contents of the editor.

## setHTML(html)

- **Parameter** `html: string`

  To set the HTML contents of the editor.
