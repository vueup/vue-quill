import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { createFilter } from 'rollup-pluginutils';
const csso = require('csso');

const config = {
  build: {
    lib: defineConfig({
      plugins: [
        vue()
      ],
      build: {
        lib: {
          entry: './src/main.ts',
          name: 'QuillEditor',
          formats: ['es', 'cjs', 'umd', 'iife'],
        },
        rollupOptions: {
          // Externalize deps that shouldn't be bundled into the library
          external: createFilter([
            'vue',
            '../themes/*'
          ], null, { resolve: false }),
          // {resolve: false} will make sure these filters are not passed to
          // path.resolve first and resolved against the current working directory
          // [
          //   'vue',
          //   '../themes/*',
          //   // '../themes/quill.snow',
          //   // '../themes/quill.bubble'
          // ],
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
    themes: defineConfig({
      build: {
        rollupOptions: {
          input: './dummy/empty.ts',
          output: {
            dir: './dummy',
          },
          plugins: [
            copy({
              targets: [{
                src: './node_modules/quill/dist/*.css',
                dest: './src/themes',
                transform: (contents, filename) => {
                  return 'const theme: string = /*html*/`\n<style>\n'
                    + contents.toString()
                      .replace(/\\[0-7]{4}/g, '\\\\$&')
                      .replace(/\\\\\\/g, '\\0o')
                    + '\n</style>`\nexport { theme };'
                },
                rename: (name: string) => {
                  return name + '.ts'
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
  } else if (command === 'build' && mode === 'themes') {
    return config.build.themes
  } else {
    return config.default
  }
}
