<script setup lang="ts">
/**
 * Custom Modules Demo
 *
 * Demonstrates:
 * - Registering custom Quill modules
 * - Passing module options
 * - Using third-party modules
 */

import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import type { QuillModule } from '@vueup/vue-quill'

// Example content
const content = ref('<p>Type here to see the counter...</p>')

// ─── Example 1: Custom Counter Module ──────────────────────────────────

/**
 * A simple counter module that tracks character count
 */
class Counter {
  quill: any
  container: HTMLElement
  options: { container: string; unit: string }

  constructor(quill: any, options: { container: string; unit: string }) {
    this.quill = quill
    this.options = options
    this.container = document.querySelector(options.container) as HTMLElement

    if (!this.container) {
      console.warn('Counter module: container not found:', options.container)
      return
    }

    quill.on('text-change', this.update.bind(this))
    this.update()
  }

  calculate() {
    const text = this.quill.getText()
    if (this.options.unit === 'word') {
      return text.split(/\s+/).filter((word: string) => word.length > 0).length
    }
    return text.length - 1 // Subtract trailing newline
  }

  update() {
    const count = this.calculate()
    const unit = this.options.unit === 'word' ? 'words' : 'characters'
    if (this.container) {
      this.container.textContent = `${count} ${unit}`
    }
  }
}

// Module configuration for VueQuill
const counterModule: QuillModule = {
  name: 'counter',
  module: Counter,
  options: {
    container: '#counter',
    unit: 'character',
  },
}

// ─── Example 2: Custom Blot (Divider) ──────────────────────────────────

// Note: In a real app, you'd import and register a custom blot
// This example shows the pattern for module registration

const contentWithDivider = ref('<p>Content with a custom divider below</p>')

// ─── Example 3: Module with No Options ─────────────────────────────────

const contentBasic = ref('<p>Basic module example</p>')

/**
 * A simple module that just logs text changes
 */
class LoggerModule {
  constructor(quill: any) {
    quill.on('text-change', () => {
      console.log('[LoggerModule] Text changed')
    })
  }
}

const loggerModule: QuillModule = {
  name: 'logger',
  module: LoggerModule,
  // No options needed
}
</script>

<template>
  <div class="modules-demo">
    <h2>Custom Modules Demo</h2>
    <p>Register and use custom Quill modules for extended functionality.</p>

    <!-- Counter Module Example -->
    <section class="demo-section">
      <h3>1. Character Counter Module</h3>
      <p>A custom module that counts characters in the editor.</p>

      <QuillEditor
        v-model="content"
        theme="snow"
        toolbar="essential"
        :modules="[counterModule]"
        placeholder="Type to see the counter update..."
      />

      <div class="counter-display">
        <span>Count:</span>
        <span id="counter">0 characters</span>
      </div>

      <details open>
        <summary>Module Configuration</summary>
        <pre>{{ JSON.stringify(counterModule, null, 2) }}</pre>
      </details>
    </section>

    <!-- Logger Module Example -->
    <section class="demo-section">
      <h3>2. Logger Module (No Options)</h3>
      <p>A simple module that doesn't require options.</p>

      <QuillEditor
        v-model="contentBasic"
        theme="snow"
        toolbar="minimal"
        :modules="[loggerModule]"
        placeholder="Type and check console for logs..."
      />

      <p class="hint">Open the browser console to see log output.</p>

      <details>
        <summary>Module Configuration</summary>
        <pre>{{ JSON.stringify(loggerModule, null, 2) }}</pre>
      </details>
    </section>

    <!-- Multiple Modules -->
    <section class="demo-section">
      <h3>3. Multiple Modules</h3>
      <p>You can register multiple modules at once.</p>

      <QuillEditor
        v-model="contentWithDivider"
        theme="snow"
        toolbar="essential"
        :modules="[counterModule, loggerModule]"
        placeholder="Multiple modules active..."
      />

      <div class="counter-display">
        <span>Count:</span>
        <span id="counter">0 characters</span>
      </div>

      <details>
        <summary>Multiple Modules Config</summary>
        <pre>:modules="[counterModule, loggerModule]"</pre>
      </details>
    </section>

    <!-- Code Example -->
    <section class="demo-section">
      <h3>How to Create a Custom Module</h3>

      <pre class="code-example">{{ moduleExample }}</pre>
    </section>
  </div>
</template>

<script lang="ts">
const moduleExample = `// 1. Define your module class
class MyModule {
  quill: any
  options: MyModuleOptions
  
  constructor(quill: any, options: MyModuleOptions) {
    this.quill = quill
    this.options = options
    
    // Set up your module functionality
    quill.on('text-change', this.handleChange.bind(this))
  }
  
  handleChange(delta: Delta, oldDelta: Delta, source: string) {
    // Handle text changes
  }
}

// 2. Create module configuration
const myModule: QuillModule = {
  name: 'myModule',      // Module name for Quill registry
  module: MyModule,      // The module class
  options: {             // Optional: module options
    feature: 'enabled',
    threshold: 100,
  },
}

// 3. Use in component
<QuillEditor
  v-model="content"
  :modules="[myModule]"
/>`

export { moduleExample }
</script>

<style scoped>
.modules-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h3 {
  margin-top: 0;
  color: #333;
}

.demo-section p {
  color: #666;
  margin-bottom: 16px;
}

.counter-display {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.counter-display span:first-child {
  font-weight: 500;
}

#counter {
  color: #1976d2;
  font-weight: bold;
}

details {
  margin-top: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

details summary {
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

pre {
  margin: 12px 0 0 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  white-space: pre-wrap;
}

.code-example {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  font-size: 13px;
  line-height: 1.5;
}

.hint {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}
</style>
