import { render } from '../dist/server/entry-server.js'

const html = await render()

if (!html.includes('VueQuill SSR example')) {
  throw new Error('SSR HTML did not include the example heading.')
}

if (!html.includes('SSR shell rendered')) {
  throw new Error('SSR HTML did not include the server-rendered status text.')
}

if (!html.includes('<div')) {
  throw new Error('SSR HTML did not include the editor placeholder element.')
}

console.log('SSR smoke render passed.')
