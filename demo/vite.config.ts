import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /^@vueup\/vue-quill$/,
        replacement: path.resolve(__dirname, '../packages/vue-quill/src'),
      },
      {
        find: /^@vueup\/vue-quill\/dist\/(.*)$/,
        replacement: path.resolve(__dirname, '../packages/vue-quill/dist/$1'),
      },
    ],
  },
})
