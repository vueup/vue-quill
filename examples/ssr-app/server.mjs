import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 5174)
const base = process.env.BASE || '/'
const modeFlagIndex = process.argv.indexOf('--mode')
const mode =
  modeFlagIndex === -1
    ? undefined
    : process.argv[modeFlagIndex + 1] || undefined
const app = express()

let vite
let productionTemplate
let productionRender

if (!isProduction) {
  vite = await createViteServer({
    appType: 'custom',
    base,
    mode,
    server: { middlewareMode: true },
  })
  app.use(vite.middlewares)
} else {
  productionTemplate = await fs.readFile(
    path.resolve(__dirname, 'dist/client/index.html'),
    'utf-8',
  )
  productionRender = (
    await import(path.resolve(__dirname, 'dist/server/entry-server.js'))
  ).render

  app.use(
    base,
    express.static(path.resolve(__dirname, 'dist/client'), { index: false }),
  )
}

app.use(async (req, res, next) => {
  try {
    const url = req.originalUrl.replace(base, '/')
    let template
    let render

    if (isProduction) {
      template = productionTemplate
      render = productionRender
    } else {
      template = await fs.readFile(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    }

    const appHtml = await render()
    const html = template.replace('<!--app-html-->', appHtml)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (error) {
    vite?.ssrFixStacktrace(error)
    next(error)
  }
})

app.listen(port, () => {
  console.log(`SSR example running at http://localhost:${port}${base}`)
})
