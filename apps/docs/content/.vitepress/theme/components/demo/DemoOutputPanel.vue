<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  delta: any
  html: string
  text: string
}

const props = defineProps<Props>()

const activeTab = ref<'delta' | 'html' | 'text'>('delta')

const tabs = [
  { id: 'delta', label: 'Delta', icon: '📦' },
  { id: 'html', label: 'HTML', icon: '🌐' },
  { id: 'text', label: 'Text', icon: '📝' },
]

const formattedDelta = computed(() => {
  try {
    return JSON.stringify(props.delta, null, 2)
  } catch {
    return '{}'
  }
})

const copied = ref(false)

async function copyOutput() {
  const content = activeTab.value === 'delta' 
    ? formattedDelta.value 
    : activeTab.value === 'html' 
      ? props.html 
      : props.text
  
  try {
    await navigator.clipboard.writeText(content)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="output-panel">
    <div class="output-header">
      <div class="output-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['output-tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id as typeof activeTab"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
      <button 
        class="copy-btn"
        :class="{ copied }"
        @click="copyOutput"
      >
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
    </div>
    <div class="output-content">
      <pre v-if="activeTab === 'delta'" class="output-code">{{ formattedDelta }}</pre>
      <pre v-else-if="activeTab === 'html'" class="output-code">{{ html }}</pre>
      <pre v-else class="output-code output-text">{{ text }}</pre>
    </div>
  </div>
</template>

<style scoped>
.output-panel {
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.output-tabs {
  display: flex;
  gap: 4px;
}

.output-tab {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.output-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-elv);
}

.output-tab.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.tab-icon {
  font-size: 12px;
}

.tab-label {
  display: none;
}

@media (min-width: 480px) {
  .tab-label {
    display: inline;
  }
}

.copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-btn:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.copy-btn.copied {
  color: var(--vp-c-green-1);
}

.output-content {
  flex: 1;
  overflow: auto;
  padding: 12px;
}

.output-code {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  white-space: pre-wrap;
  word-break: break-word;
}

.output-text {
  white-space: pre-wrap;
}
</style>
