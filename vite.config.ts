import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/main.ts'),
      name: 'QuillEditor',
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      },
      plugins: [
        copy({
          targets: [
            { src: './node_modules/quill/dist/quill.core.css', dest: './dist' },
            { src: './node_modules/quill/dist/quill.snow.css', dest: './dist' },
            { src: './node_modules/quill/dist/quill.bubble.css', dest: './dist' }
          ],
          hook: 'writeBundle',
          verbose: true,
          copyOnce: true
        })
      ]
    }
  }
})
