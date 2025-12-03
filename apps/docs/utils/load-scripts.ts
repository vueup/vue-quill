interface ScriptItem {
  src: string
  promise: Promise<void>
  resolve: () => void
}

interface ScriptLoader {
  scripts: ScriptItem[]
  index: number
  loading: boolean
  next: () => void
}

const scriptLoader: ScriptLoader = {
  scripts: [],
  index: -1,
  loading: false,
  next() {
    if (this.loading) return

    this.loading = true
    const item = this.scripts[++this.index]
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = item.src

    script.onload = () => {
      this.loading = false
      if (this.index < this.scripts.length - 1) {
        this.next()
      }
      item.resolve()
    }

    document.head.appendChild(script)
  },
}

export function loadScript(src: string, isAsync = false): Promise<void> {
  const existing = scriptLoader.scripts.find((s) => s.src === src)
  if (existing) return existing.promise

  let resolve: () => void = () => {}
  const promise = new Promise<void>((r) => {
    resolve = r
  })

  const item: ScriptItem = { src, promise, resolve }
  scriptLoader.scripts.push(item)

  if (!scriptLoader.loading) {
    scriptLoader.next()
  }

  return promise
}

function onReady(fn: () => void): void {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

onReady(() => {
  loadScript(
    'https://www.googletagmanager.com/gtag/js?id=G-NKRWLJHDXL',
    true
  ).then(() => {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', 'G-NKRWLJHDXL')
  })
})
