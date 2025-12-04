<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import DemoTabs from './DemoTabs.vue'
import DemoPresets from './DemoPresets.vue'
import DemoOutputPanel from './DemoOutputPanel.vue'
import { presets, getPresetById } from './presets'

// Editor state
const editorRef = ref<any>(null)
const editorContent = ref(presets[0].delta)
const editorKey = ref(0) // Key for forcing component recreation

// Configuration
const selectedTheme = ref('snow')
const selectedToolbar = ref('essential')
const selectedPreset = ref('welcome')
const activeView = ref('preview')
const showOutput = ref(true)

// Output
const htmlOutput = ref('')
const textOutput = ref('')

// Options
const themeOptions = [
  { id: 'snow', label: 'Snow', icon: '❄️' },
  { id: 'bubble', label: 'Bubble', icon: '💬' },
  { id: '', label: 'None', icon: '⬜' },
]

const toolbarOptions = [
  { id: 'essential', label: 'Essential', icon: '✨' },
  { id: 'minimal', label: 'Minimal', icon: '📝' },
  { id: 'full', label: 'Full', icon: '🔧' },
  { id: '', label: 'None', icon: '🚫' },
]

const viewTabs = [
  { id: 'preview', label: 'Preview', icon: '👁️' },
  { id: 'code', label: 'Code', icon: '💻' },
]

// Generated code
const generatedCode = computed(() => {
  const theme = selectedTheme.value ? `\n  theme="${selectedTheme.value}"` : ''
  const toolbar = selectedToolbar.value ? `\n  toolbar="${selectedToolbar.value}"` : ''
  
  return `<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const content = ref('')
<\/script>

<template>
  <QuillEditor
    v-model:content="content"
    content-type="delta"${theme}${toolbar}
  />
</template>`
})

// Recreate editor when theme, toolbar, or preset changes
watch([selectedTheme, selectedToolbar, selectedPreset], ([,, preset]) => {
  const presetData = getPresetById(preset)
  if (presetData) {
    editorContent.value = JSON.parse(JSON.stringify(presetData.delta))
  }
  editorKey.value++
})

// Update output displays
function updateOutput() {
  const editor = editorRef.value?.editor?.value
  if (editor) {
    htmlOutput.value = editor.getHTML()
    textOutput.value = editor.getText()
  }
}

onMounted(() => setTimeout(updateOutput, 100))

// Copy code
const codeCopied = ref(false)
async function copyCode() {
  await navigator.clipboard.writeText(generatedCode.value)
  codeCopied.value = true
  setTimeout(() => codeCopied.value = false, 2000)
}
</script>

<template>
  <div class="demo-container">
    <!-- Top Controls Bar -->
    <div class="demo-controls">
      <div class="controls-left">
        <DemoPresets
          v-model="selectedPreset"
          :presets="presets"
        />
      </div>
      <div class="controls-right">
        <DemoTabs v-model="activeView" :tabs="viewTabs" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="demo-main">
      <!-- Sidebar Options -->
      <aside class="demo-sidebar">
        <div class="sidebar-section">
          <h4 class="sidebar-title">Theme</h4>
          <div class="option-grid">
            <button
              v-for="theme in themeOptions"
              :key="theme.id"
              :class="['option-btn', { active: selectedTheme === theme.id }]"
              @click="selectedTheme = theme.id"
            >
              <span class="option-icon">{{ theme.icon }}</span>
              <span class="option-label">{{ theme.label }}</span>
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h4 class="sidebar-title">Toolbar</h4>
          <div class="option-grid">
            <button
              v-for="toolbar in toolbarOptions"
              :key="toolbar.id"
              :class="['option-btn', { active: selectedToolbar === toolbar.id }]"
              @click="selectedToolbar = toolbar.id"
            >
              <span class="option-icon">{{ toolbar.icon }}</span>
              <span class="option-label">{{ toolbar.label }}</span>
            </button>
          </div>
        </div>

        <div class="sidebar-section sidebar-toggle">
          <label class="toggle-label">
            <input v-model="showOutput" type="checkbox" class="toggle-input" />
            <span class="toggle-switch"></span>
            <span class="toggle-text">Show Output</span>
          </label>
        </div>
      </aside>

      <!-- Editor Area -->
      <div class="demo-editor-area">
        <!-- Preview Mode -->
        <div v-show="activeView === 'preview'" class="editor-preview">
          <div class="editor-wrapper">
            <QuillEditor
              :key="editorKey"
              ref="editorRef"
              v-model="editorContent"
              content-type="delta"
              :theme="selectedTheme"
              :toolbar="selectedToolbar"
              @text-change="updateOutput"
            />
          </div>
          
          <!-- Output Panel -->
          <Transition name="slide">
            <div v-if="showOutput" class="output-wrapper">
              <DemoOutputPanel
                :delta="editorContent"
                :html="htmlOutput"
                :text="textOutput"
              />
            </div>
          </Transition>
        </div>

        <!-- Code Mode -->
        <div v-show="activeView === 'code'" class="editor-code">
          <div class="code-panel">
            <div class="code-header">
              <div class="code-file">
                <span class="file-icon">📄</span>
                <span class="file-name">MyEditor.vue</span>
              </div>
              <button 
                class="copy-code-btn" 
                :class="{ copied: codeCopied }"
                @click="copyCode"
              >
                <svg v-if="!codeCopied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ codeCopied ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
            <pre class="code-content"><code>{{ generatedCode }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

/* Controls Bar */
.demo-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

@media (min-width: 768px) {
  .demo-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
}

/* Main Content */
.demo-main {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .demo-main {
    flex-direction: row;
  }
}

/* Sidebar */
.demo-sidebar {
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

@media (min-width: 768px) {
  .demo-sidebar {
    width: 180px;
    flex-shrink: 0;
    border-bottom: none;
    border-right: 1px solid var(--vp-c-divider);
  }
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 10px;
}

.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (min-width: 768px) {
  .option-grid {
    flex-direction: column;
  }
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
}

@media (min-width: 768px) {
  .option-btn {
    width: 100%;
  }
}

.option-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.option-btn.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.option-icon {
  font-size: 14px;
}

.option-label {
  font-weight: 500;
}

/* Toggle */
.sidebar-toggle {
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-switch {
  width: 36px;
  height: 20px;
  background: var(--vp-c-divider);
  border-radius: 10px;
  position: relative;
  transition: background 0.2s ease;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-switch {
  background: var(--vp-c-brand-1);
}

.toggle-input:checked + .toggle-switch::after {
  transform: translateX(16px);
}

.toggle-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* Editor Area */
.demo-editor-area {
  flex: 1;
  min-height: 400px;
}

.editor-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
}

@media (min-width: 1024px) {
  .editor-preview {
    flex-direction: row;
  }
}

.editor-wrapper {
  flex: 1;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.editor-wrapper :deep(.ql-container) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-wrapper :deep(.ql-editor) {
  flex: 1;
  min-height: 250px;
}

.editor-wrapper :deep(.ql-editor h2) {
  border: none;
}

.output-wrapper {
  width: 100%;
  height: 200px;
  border-top: 1px solid var(--vp-c-divider);
}

@media (min-width: 1024px) {
  .output-wrapper {
    width: 320px;
    height: auto;
    border-top: none;
    border-left: 1px solid var(--vp-c-divider);
  }
}

/* Code View */
.editor-code {
  height: 100%;
  padding: 16px;
}

.code-panel {
  height: 100%;
  background: var(--vp-code-block-bg);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.code-file {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  font-size: 14px;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
}

.copy-code-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-code-btn:hover {
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
}

.copy-code-btn.copied {
  color: var(--vp-c-green-1);
}

.code-content {
  margin: 0;
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  overflow: auto;
  max-height: 350px;
}

.code-content code {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>

<style>
/* Global Quill overrides */
.demo-container .ql-editor h2 {
  border: none;
}

.demo-container img {
  display: inline-block !important;
}
</style>
