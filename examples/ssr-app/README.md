# Vue Quill SSR Example

This Vite example verifies that `@vueup/vue-quill` can be imported and rendered
in a Vue SSR app without loading the Quill browser runtime on the server.

The server-rendered HTML contains a stable editor placeholder. The real Quill
editor is created in the browser after Vue mounts.

## Dependency behavior

- `npm run dev` and `npm run build` use the local workspace source from
  `../../packages/vue-quill` when available.
- `npm run dev:npm` and `npm run build:npm` force the released npm package for
  comparison after an SSR-capable release is published.

## Commands

```sh
npm install
npm run dev
npm run test:ssr
npm run build
npm run preview
```

The app follows the Vite SSR structure with `entry-client.ts`,
`entry-server.ts`, and a custom Node server:

https://vite.dev/guide/ssr
