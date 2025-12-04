<script setup lang="ts">
interface Preset {
  id: string
  label: string
  icon: string
}

interface Props {
  presets: Preset[]
}

defineProps<Props>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div class="demo-presets">
    <span class="presets-label">Templates:</span>
    <div class="presets-list">
      <button
        v-for="preset in presets"
        :key="preset.id"
        :class="['preset-btn', { active: modelValue === preset.id }]"
        @click="modelValue = preset.id"
        :title="preset.label"
      >
        <span class="preset-icon">{{ preset.icon }}</span>
        <span class="preset-label">{{ preset.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.demo-presets {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.presets-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.presets-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.preset-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: white;
}

.preset-icon {
  font-size: 14px;
}

.preset-label {
  display: none;
}

@media (min-width: 640px) {
  .preset-label {
    display: inline;
  }
}
</style>
