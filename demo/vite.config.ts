import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      // CSS must come before the main package alias to avoid incorrect resolution
      {
        find: '@vueup/vue-quill/style.css',
        replacement: path.resolve(__dirname, '../packages/vue-quill/dist/style.css'),
      },
      {
        find: '@vueup/vue-quill',
        replacement: path.resolve(__dirname, '../packages/vue-quill/src'),
      },
    ],
  },
})
