import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { UserConfigExport } from 'vite'

// https://vitejs.dev/config/
const config = {
  build: defineConfig({
    plugins: [
      vue()
    ],
    publicDir: './public',
    base: '/vueup-quill/',
    build: {
      outDir: './dist',
      rollupOptions: {
        plugins: [
          copy({
            targets: [{ src: '../docs/.vitepress/dist/*', dest: './dist/docs' }],
            hook: 'writeBundle',
            verbose: true,
            copyOnce: true
          })
        ]
      }
    }
  }),
  default: defineConfig({
    plugins: [
      vue()
    ],
    publicDir: './public',
  })
}

export default ({ command, mode }): UserConfigExport => {
  if (command === 'build') {
    return config.build
  } else {
    return config.default
  }
}