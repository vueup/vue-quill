import { readFile } from 'node:fs/promises'

const html = await readFile('dist/client/index.html', 'utf8')

const expectedSnippets = [
  'Vue Quill Vite SSR Example',
  'Comprehensive Vue Quill examples',
  'Basic editor',
  '/vue-quill/examples/vite-app/ssr/assets/',
]

for (const snippet of expectedSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Vite SSR Pages HTML did not include "${snippet}".`)
  }
}

console.log('Vite SSR Pages smoke passed.')
