import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser';
const csso = require('csso');

const pkg = require('./package.json')

const libraryName = 'vue-quill'
const mainEntryFile = 'src/main.ts'

export default {
  input: mainEntryFile,
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.commonjs,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      name: camelCase(libraryName),
      globals: { vue: 'Vue' },
      plugins: [
        terser(),
        // Copy Quill css theme files to 'dist' directory
        copy({
          targets: [{
            src: './node_modules/quill/dist/quill.core.css',
            dest: './dist',
            rename: 'vue-quill.core.css',
            transform: (contents, filename) => {
              return csso.minify(contents.toString()).css
            }
          },
          {
            src: './node_modules/quill/dist/quill.bubble.css',
            dest: './dist',
            rename: 'vue-quill.bubble.css',
            transform: (contents, filename) => {
              return csso.minify(contents.toString()).css
            }
          },
          {
            src: './src/themes/css/vue-quill.snow.css',
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
    },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'vue')
  external: ['vue'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
}
