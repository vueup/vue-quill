import { once } from 'node:events'
import { spawn } from 'node:child_process'

const port = 4176
const baseUrl = `http://127.0.0.1:${port}`
const routes = [
  {
    path: '/',
    expected: 'Comprehensive Vue Quill examples',
    name: 'catalog universal SSR',
  },
  {
    path: '/ssr',
    expected: 'Server-rendered shell, client-mounted editor',
    name: 'universal SSR route',
  },
  {
    path: '/client-only',
    expected: '<div id="__nuxt"',
    name: 'client-only route shell',
  },
  {
    path: '/prerendered',
    expected: 'Static HTML with hydrated editor',
    name: 'prerendered route',
  },
  {
    path: '/swr',
    expected: 'Cached server response with browser editor',
    name: 'SWR route',
  },
  {
    path: '/isr',
    expected: 'Incremental static route with browser editor',
    name: 'ISR route',
  },
]

const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: {
    ...process.env,
    HOST: '127.0.0.1',
    PORT: String(port),
    NODE_ENV: 'production',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})

let logs = ''
server.stdout.on('data', (chunk) => {
  logs += chunk
})
server.stderr.on('data', (chunk) => {
  logs += chunk
})

const waitForServer = async () => {
  const started = Date.now()
  while (Date.now() - started < 15000) {
    try {
      const response = await fetch(`${baseUrl}/ssr`)
      if (response.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Nuxt preview server did not start.\n${logs}`)
}

try {
  await waitForServer()

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route.path}`)
    const html = await response.text()

    if (!response.ok) {
      throw new Error(`${route.name} returned ${response.status}`)
    }

    if (!html.includes(route.expected)) {
      throw new Error(`${route.name} did not include "${route.expected}"`)
    }
  }

  console.log(`Nuxt rendering smoke passed for ${routes.length} routes.`)
} finally {
  server.kill('SIGTERM')
  await Promise.race([
    once(server, 'exit'),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ])
}
