# Vue Quill Vite Example

This is a fresh Vite Vue TypeScript app scaffolded with `npm create vite@latest` and adapted to showcase `@vueup/vue-quill`.

## Dependency behavior

- `npm run dev` uses the local workspace source from `../../packages/vue-quill` when that package is available.
- `npm run dev:npm` forces the released npm package, which is useful for comparison.
- `npm run build` does not apply the local alias, so production builds resolve `@vueup/vue-quill` from npm.

The source for the example lives in `../vue-quill/src` and is imported through the `@vue-quill-example/*` alias.

When deployed with the docs site, the example is published at:

https://vueup.github.io/vue-quill/examples/vite-app/

## Commands

```sh
npm install
npm run test
npm run dev
npm run build
npm run build:pages
npm run preview
```

## Vite Reference

The project follows the current Vite guide for scaffolding:

```sh
npm create vite@latest examples/vite-app -- --template vue-ts
```
