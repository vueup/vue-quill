import { render } from '../dist/server/entry-server.js'

const html = await render()

if (!html.includes('Comprehensive Vue Quill examples')) {
  throw new Error('SSR HTML did not include the Vite example heading.')
}

if (!html.includes('Basic editor')) {
  throw new Error('SSR HTML did not include the basic editor section.')
}

if (!html.includes('<div')) {
  throw new Error('SSR HTML did not include editor placeholder elements.')
}

console.log('Vite SSR smoke render passed.')
