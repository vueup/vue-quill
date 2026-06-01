import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'

export const render = () => {
  return renderToString(createApp())
}
