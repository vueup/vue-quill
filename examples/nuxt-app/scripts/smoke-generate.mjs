import { readFile } from 'node:fs/promises'

const routes = [
  ['index.html', 'Comprehensive Vue Quill examples'],
  ['ssr/index.html', 'Server-rendered shell, client-mounted editor'],
  ['client-only/index.html', '<div id="__nuxt"'],
  ['prerendered/index.html', 'Static HTML with hydrated editor'],
  ['swr/index.html', 'Cached server response with browser editor'],
  ['isr/index.html', 'Incremental static route with browser editor'],
]

for (const [file, expected] of routes) {
  const html = await readFile(`.output/public/${file}`, 'utf8')
  if (!html.includes(expected)) {
    throw new Error(`${file} did not include "${expected}"`)
  }
}

console.log(`Nuxt generate smoke passed for ${routes.length} routes.`)
