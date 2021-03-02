import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
const csso = require('csso');

const config = {
  build: {
    lib: defineConfig({
      plugins: [
        vue()
      ],
      build: {
        sourcemap: true,
        lib: {
          entry: './src/main.ts',
          name: 'QuillEditor',
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
                src: './node_modules/quill/dist/*.css',
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
    }),
    demo: defineConfig({
      plugins: [
        vue()
      ],
      publicDir: './demo/public',
      base: '/vueup-quill/',
      build: {
        outDir: './demo/dist',
        rollupOptions: {
          plugins: [
            copy({
              targets: [{ src: './docs/.vitepress/dist/*', dest: './demo/dist/docs' }],
              hook: 'writeBundle',
              verbose: true,
              copyOnce: true
            })
          ]
        }
      }
    }),
  },
  default: defineConfig({
    plugins: [
      vue()
    ],
    publicDir: './demo/public',
  })
}

export default ({ command, mode }): UserConfigExport => {
  if (command === 'build' && mode === 'lib') {
    return config.build.lib
  } else if (command === 'build' && mode === 'demo') {
    return config.build.demo
  } else {
    return config.default
  }
}
