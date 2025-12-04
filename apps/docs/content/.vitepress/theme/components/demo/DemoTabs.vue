<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon?: string
}

interface Props {
  tabs: Tab[]
}

defineProps<Props>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div class="demo-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['demo-tab', { active: modelValue === tab.id }]"
      @click="modelValue = tab.id"
    >
      <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
      <span class="tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.demo-tabs {
  display: flex;
  gap: 2px;
  background: var(--vp-c-bg-soft);
  padding: 4px;
  border-radius: 8px;
  width: fit-content;
}

.demo-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-elv);
}

.demo-tab.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 16px;
}

.tab-label {
  white-space: nowrap;
}
</style>
