const loadScript: any = (src: string, isAsync: boolean) => {
  // Initialize scripts queue
  if (loadScript.scripts === undefined) {
    loadScript.scripts = []
    loadScript.index = -1
    loadScript.loading = false
    loadScript.next = () => {
      if (loadScript.loading) return

      // Load the next queue item
      loadScript.loading = true
      const item = loadScript.scripts[++loadScript.index]
      const head = document.getElementsByTagName('head')[0]
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = item.src
      if (isAsync) script.setAttribute('async', '')
      // When complete, start next item in queue and resolve this item's promise
      script.onload = () => {
        loadScript.loading = false
        if (loadScript.index < loadScript.scripts.length - 1) loadScript.next()
        item.resolve()
      }
      head.appendChild(script)
    }
  }

  // Adding a script to the queue
  if (src) {
    // Check if already added
    for (let i = 0; i < loadScript.scripts.length; i++) {
      if (loadScript.scripts[i].src == src) return loadScript.scripts[i].promise
    }
    // Add to the queue
    const item: any = { src: src }
    item.promise = new Promise((resolve) => {
      item.resolve = resolve
    })
    loadScript.scripts.push(item)
    loadScript.next()
  }

  // Return the promise of the last queue item
  return loadScript.scripts[loadScript.scripts.length - 1].promise
}

function onReady(fn: () => void) {
  if (document.readyState != 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

export { onReady, loadScript }
