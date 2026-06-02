import { readFile } from 'node:fs/promises'

const html = await readFile('dist/index.html', 'utf8')

const expectedSnippets = [
  'Vue Quill Vite Example',
  '/vue-quill/examples/vite-app/assets/',
  '<div id="app"></div>',
]

for (const snippet of expectedSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Vite Pages HTML did not include "${snippet}".`)
  }
}

console.log('Vite Pages smoke passed.')
