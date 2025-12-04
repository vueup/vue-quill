<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  code: string
  language?: string
  filename?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue',
  filename: ''
})

const copied = ref(false)
const copyTimeout = ref<number | null>(null)

const displayCode = computed(() => {
  return props.code.trim()
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(displayCode.value)
    copied.value = true
    
    if (copyTimeout.value) {
      clearTimeout(copyTimeout.value)
    }
    
    copyTimeout.value = window.setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="code-block">
    <div class="code-header">
      <div class="code-info">
        <span class="code-language">{{ language }}</span>
        <span v-if="filename" class="code-filename">{{ filename }}</span>
      </div>
      <button 
        class="copy-button" 
        :class="{ copied }"
        @click="copyCode"
        :aria-label="copied ? 'Copied!' : 'Copy code'"
      >
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span class="copy-text">{{ copied ? 'Copied!' : 'Copy' }}</span>
      </button>
    </div>
    <pre class="code-content"><code>{{ displayCode }}</code></pre>
  </div>
</template>

<style scoped>
.code-block {
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.code-language {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 4px;
}

.code-filename {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.copy-button.copied {
  color: var(--vp-c-green-1);
}

.copy-text {
  display: none;
}

@media (min-width: 640px) {
  .copy-text {
    display: inline;
  }
}

.code-content {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.6;
}

.code-content code {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}
</style>
