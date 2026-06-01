import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

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
const exampleSource = fileURLToPath(
  new URL('../vue-quill/src/', import.meta.url),
)

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const useLocalVueQuill =
    command === 'serve' &&
    mode !== 'npm' &&
    existsSync(localVueQuillRoot) &&
    existsSync(localVueQuillEntry)
  const useLocalVueQuillStyles =
    useLocalVueQuill && existsSync(localVueQuillSnowCss)

  return {
    plugins: [vue()],
    resolve: {
      alias: [
        { find: '@vue-quill-example', replacement: exampleSource },
        {
          find: /^@vueup\/vue-quill$/,
          replacement: useLocalVueQuill ? localVueQuillEntry : npmVueQuillEntry,
        },
        ...(useLocalVueQuill
          ? [
              ...(useLocalVueQuillStyles
                ? [
                    {
                      find: /^@vueup\/vue-quill\/dist\/(.*)$/,
                      replacement: `${localVueQuillDist}$1`,
                    },
                  ]
                : []),
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
