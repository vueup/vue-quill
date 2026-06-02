import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = path.join(rootDir, 'dist/client')
const templatePath = path.join(clientDir, 'index.ssr.html')
const outputPath = path.join(clientDir, 'index.html')
const serverEntryUrl = pathToFileURL(
  path.join(rootDir, 'dist/server/entry-server.js'),
)

const template = await readFile(templatePath, 'utf8')
const { render } = await import(serverEntryUrl.href)
const appHtml = await render()

if (!template.includes('<!--app-html-->')) {
  throw new Error('SSR template is missing the app HTML placeholder.')
}

await writeFile(outputPath, template.replace('<!--app-html-->', appHtml))

console.log(`Vite SSR static HTML written to ${outputPath}.`)
