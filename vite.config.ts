import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
const csso = require('csso');

export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    // sourcemap: true,
    lib: {
      entry: './src/main.ts',
      name: 'VueUpQuill',
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled into the library
      external: ['vue'],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build for externalized deps
        globals: { vue: 'Vue' }
      },
      plugins: [
        copy({
          targets: [{
            src: './node_modules/quill/dist/quill.core.css',
            dest: './dist',
            transform: (contents, filename) => {
              return csso.minify(contents.toString()).css
            }
          },
          {
            src: './node_modules/quill/dist/quill.bubble.css',
            dest: './dist',
            transform: (contents, filename) => {
              return csso.minify(contents.toString()).css
            }
          },
          {
            src: './src/themes/quill.snow.css',
            dest: './dist',
            transform: (contents, filename) => {
              return csso.minify(contents.toString()).css
            }
          }],
          hook: 'writeBundle',
          verbose: true,
          copyOnce: true
        })
      ]
    }
  }
})

