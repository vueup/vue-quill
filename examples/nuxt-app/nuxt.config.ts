import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const localVueQuillRoot = fileURLToPath(
  new URL('../../packages/vue-quill/', import.meta.url),
)
const localVueQuillEntry = fileURLToPath(
  new URL('../../packages/vue-quill/src/index.ts', import.meta.url),
)
const localVueQuillSnowCss = fileURLToPath(
  new URL('../../packages/vue-quill/dist/vue-quill.snow.css', import.meta.url),
)
const localVueQuillBubbleCss = fileURLToPath(
  new URL(
    '../../packages/vue-quill/dist/vue-quill.bubble.css',
    import.meta.url,
  ),
)
const npmVueQuillEntry = fileURLToPath(
  new URL(
    './node_modules/@vueup/vue-quill/dist/vue-quill.esm-bundler.js',
    import.meta.url,
  ),
)
const npmVueQuillSnowCss = fileURLToPath(
  new URL(
    './node_modules/@vueup/vue-quill/dist/vue-quill.snow.css',
    import.meta.url,
  ),
)
const npmVueQuillBubbleCss = fileURLToPath(
  new URL(
    './node_modules/@vueup/vue-quill/dist/vue-quill.bubble.css',
    import.meta.url,
  ),
)
const exampleSource = fileURLToPath(
  new URL('../vue-quill/src/', import.meta.url),
)

const forceNpmVueQuill = process.env.NUXT_VUE_QUILL_SOURCE === 'npm'
const useLocalVueQuill =
  !forceNpmVueQuill &&
  existsSync(localVueQuillRoot) &&
  existsSync(localVueQuillEntry)
const useLocalVueQuillStyles =
  useLocalVueQuill &&
  existsSync(localVueQuillSnowCss) &&
  existsSync(localVueQuillBubbleCss)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: [
    '@vueup/vue-quill/dist/vue-quill.snow.css',
    '@vueup/vue-quill/dist/vue-quill.bubble.css',
    '~/assets/styles.css',
  ],
  alias: {
    '@vue-quill-example': exampleSource,
    '@vueup/vue-quill/dist/vue-quill.snow.css': useLocalVueQuillStyles
      ? localVueQuillSnowCss
      : npmVueQuillSnowCss,
    '@vueup/vue-quill/dist/vue-quill.bubble.css': useLocalVueQuillStyles
      ? localVueQuillBubbleCss
      : npmVueQuillBubbleCss,
  },
  routeRules: {
    '/client-only': { ssr: false },
    '/prerendered': { prerender: true },
    '/swr': { swr: 60 },
    '/isr': { isr: 60 },
  },
  vite: {
    optimizeDeps: {
      include: ['quill', 'quill-delta'],
    },
    resolve: {
      alias: [
        {
          find: /^@vueup\/vue-quill$/,
          replacement: useLocalVueQuill ? localVueQuillEntry : npmVueQuillEntry,
        },
      ],
    },
    server: {
      fs: {
        allow: ['../..'],
      },
    },
  },
})
