# Vue Quill Example

This folder contains the reusable Vue Quill example source. The Vite shell in
`../vite-app` and the Nuxt shell in `../nuxt-app` import this source through the
`@vue-quill-example/*` alias.

Covered patterns:

- Basic `QuillEditor` usage
- `v-model:content` with HTML content
- Delta content initialization
- Built-in, array-based, and custom container toolbars
- Snow, Bubble, and core theme variants
- Placeholder, read-only, and live `enable` states
- `ready`, `focus`, `blur`, `textChange`, `selectionChange`, and `editorChange` events
- Editor ref methods such as `focus()`, `setHTML()`, and `getHTML()`
- Form-style validation and submission state

Run it from the Vite app:

```sh
cd ../vite-app
npm install
npm run dev
```

Run the Nuxt rendering-strategy example:

```sh
cd ../nuxt-app
npm install
npm run dev
```
