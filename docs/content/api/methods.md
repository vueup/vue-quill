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

## getContents(index, length)

- **Parameter:** `index?: number, length?: number`
- **Return:** `content: string | Delta`

  Returns the contents of the editor.

## setContents(content, source)

- **Parameter:** `content: string | Delta, source: 'api' | 'user' | 'silent'`

  To set the contents of the editor.

## getHTML()
  
- **Return:** `html: string`

  Returns the full HTML contents of the editor.

## setHTML(html)

- **Parameter:** `html: string`

  To set the HTML contents of the editor.
  
## pasteHTML(html, source)

- **Parameter:** `html: string, source: 'api' | 'user' | 'silent'`

  To import raw HTML from a non-Quill environment.

## getText(index, length)
  
- **Parameter:** `index?: number, length?: number`
- **Return:** `text: string`

  Returns the full text contents of the editor.

## setText(text)

- **Parameter:** `text: string`

  To set the text contents of the editor.
