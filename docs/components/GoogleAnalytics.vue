<template></template>

<script setup lang="ts">
import { onMounted } from 'vue'

let loadScript: any = (src: string, isAsync: boolean) => {
  // Initialize scripts queue
  if (loadScript.scripts === undefined) {
    loadScript.scripts = []
    loadScript.index = -1
    loadScript.loading = false
    loadScript.next = () => {
      if (loadScript.loading) return

      // Load the next queue item
      loadScript.loading = true
      let item = loadScript.scripts[++loadScript.index]
      let head = document.getElementsByTagName('head')[0]
      let script = document.createElement('script')
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
    let item: any = { src: src }
    item.promise = new Promise((resolve) => {
      item.resolve = resolve
    })
    loadScript.scripts.push(item)
    loadScript.next()
  }

  // Return the promise of the last queue item
  return loadScript.scripts[loadScript.scripts.length - 1].promise
}

onMounted(() => {
  // Global site tag (gtag.js) - Google Analytics
  loadScript('https://www.googletagmanager.com/gtag/js?id=G-NKRWLJHDXL').then(
    function () {
      /* @ts-ignore */
      window.dataLayer = window.dataLayer || []
      function gtag() {
        // @ts-ignore
        dataLayer.push(arguments)
      }
      // @ts-ignore
      gtag('js', new Date())
      // @ts-ignore
      gtag('config', 'G-NKRWLJHDXL')
    }
  )
})
</script>
