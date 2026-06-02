import { renderToString } from 'vue/server-renderer'
import { createSsrApp } from './create-ssr-app'

export const render = () => {
  return renderToString(createSsrApp())
}
