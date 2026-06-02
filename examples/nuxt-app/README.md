# Vue Quill Nuxt Example

This app was scaffolded with the current Nuxt installer:

```sh
npm create nuxt@latest examples/nuxt-app -- --template=minimal
```

It demonstrates the same Vue Quill usage patterns as the Vite example, plus
Nuxt rendering strategies:

- `/` - full Vue Quill catalog on Nuxt universal rendering.
- `/ssr` - explicit SSR shell with browser-mounted editors.
- `/client-only` - `routeRules` with `ssr: false`.
- `/prerendered` - `routeRules` with `prerender: true`.
- `/swr` - `routeRules` with stale-while-revalidate caching.
- `/isr` - `routeRules` with incremental static regeneration for supported
  Nitro providers.

## Dependency behavior

- `npm run dev`, `npm run build`, and `npm run generate` use the local
  workspace source from `../../packages/vue-quill` when it is available. This
  lets the Nuxt SSR example validate unreleased package changes.
- `npm run dev:npm`, `npm run build:npm`, and `npm run generate:npm` force the
  released npm package with `NUXT_VUE_QUILL_SOURCE=npm`.
- `npm run generate:pages` builds static output for GitHub Pages under
  `/vue-quill/examples/nuxt-app/`.
- After an SSR-capable Vue Quill release is published, the npm-mode scripts can
  be used as production-package checks.

The shared catalog metadata and small support components live in
`../vue-quill/src` and are imported through the `@vue-quill-example/*` alias.

## Commands

```sh
npm install
npm run dev
npm run typecheck
npm run test:rendering
npm run test:generate
npm run test:pages
npm run generate:pages
npm run preview
```
