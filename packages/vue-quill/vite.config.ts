import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      cleanVueFileName: true,
      tsconfigPath: './tsconfig.json',
      include: ['src/**/*.ts'],
      exclude: ['src/**/__tests__/**', 'src/**/*.vue'],
      // Skip Vue files to avoid complex type inference issues
      // Vue component types will be inferred at runtime
      strictOutput: false,
      logLevel: 'warn',
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VueQuill',
      fileName: (format) => `vue-quill.${format}.js`,
      formats: ['es', 'cjs'],
    },

    rollupOptions: {
      external: ['vue', 'quill'],
      output: {
        globals: {
          vue: 'Vue',
          quill: 'Quill',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name ?? 'assets/[name][extname]'
        },
      },
    },

    sourcemap: true,
    cssCodeSplit: false,
    minify: 'esbuild',
  },
})
