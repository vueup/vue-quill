# Vue Quill Vite Example

This is a fresh Vite Vue TypeScript app scaffolded with `npm create vite@latest` and adapted to showcase `@vueup/vue-quill`.

It also includes a small Vite SSR server and smoke test so the same example can
verify that VueQuill imports during server rendering and hydrates in the
browser.

## Dependency behavior

- `npm run dev` and `npm run dev:ssr` use the local workspace source from `../../packages/vue-quill` when that package is available.
- `npm run dev:npm` forces the released npm package, which is useful for comparison.
- `npm run build` and `npm run build:pages` do not apply the local alias, so production SPA builds resolve `@vueup/vue-quill` from npm.
- `npm run build:ssr:pages` builds a static, prerendered SSR page for GitHub Pages using the released npm package.
- `npm run test:ssr` and `npm run build:ssr` intentionally use the local workspace source through Vite's `workspace-ssr` and `workspace` modes so CI can verify unreleased SSR changes.
- `npm run build:ssr:npm` forces the released npm package for comparison after an SSR-capable release is published.

The source for the example lives in `../vue-quill/src` and is imported through the `@vue-quill-example/*` alias.

When deployed with the docs site, the example is published at:

https://vueup.github.io/vue-quill/examples/vite-app/

The Vite example includes a small rendering navigation that switches between
the SPA build and the Pages-compatible static SSR build. The SSR build is
published at:

https://vueup.github.io/vue-quill/examples/vite-app/ssr/

## Commands

```sh
npm install
npm run test
npm run test:ssr
npm run dev
npm run dev:ssr
npm run build
npm run build:ssr
npm run build:pages
npm run test:pages
npm run build:ssr:pages
npm run test:ssr:pages
npm run preview
npm run preview:ssr
```

## Vite Reference

The project follows the current Vite guide for scaffolding:

```sh
npm create vite@latest examples/vite-app -- --template vue-ts
```

The SSR path follows the Vite SSR guide with `index.ssr.html`, `server.mjs`,
`src/entry-client.ts`, and `src/entry-server.ts`:

https://vite.dev/guide/ssr
