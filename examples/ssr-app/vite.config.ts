import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const localVueQuillRoot = fileURLToPath(
  new URL('../../packages/vue-quill/', import.meta.url),
)
const localVueQuillEntry = fileURLToPath(
  new URL('../../packages/vue-quill/src/index.ts', import.meta.url),
)
const localVueQuillDist = fileURLToPath(
  new URL('../../packages/vue-quill/dist/', import.meta.url),
)
const localVueQuillSnowCss = fileURLToPath(
  new URL('../../packages/vue-quill/dist/vue-quill.snow.css', import.meta.url),
)
const npmVueQuillEntry = fileURLToPath(
  new URL(
    './node_modules/@vueup/vue-quill/dist/vue-quill.esm-bundler.js',
    import.meta.url,
  ),
)

// https://vite.dev/guide/ssr
export default defineConfig(({ mode }) => {
  const useLocalVueQuill =
    mode !== 'npm' &&
    existsSync(localVueQuillRoot) &&
    existsSync(localVueQuillEntry)
  const useLocalVueQuillStyles =
    useLocalVueQuill && existsSync(localVueQuillSnowCss)

  return {
    plugins: [vue()],
    resolve: {
      alias: [
        {
          find: /^@vueup\/vue-quill$/,
          replacement: useLocalVueQuill ? localVueQuillEntry : npmVueQuillEntry,
        },
        ...(useLocalVueQuillStyles
          ? [
              {
                find: /^@vueup\/vue-quill\/dist\/(.*)$/,
                replacement: `${localVueQuillDist}$1`,
              },
            ]
          : []),
      ],
    },
    server: {
      fs: {
        allow: ['../..'],
      },
    },
  }
})
