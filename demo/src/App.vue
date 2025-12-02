<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { QuillEditor, useEditor, EditorContent } from '@vueup/vue-quill'
import ContentTypes from './examples/ContentTypes.vue'
import ThemeToolbar from './examples/ThemeToolbar.vue'
import CustomModules from './examples/CustomModules.vue'
import ProgrammaticAccess from './examples/ProgrammaticAccess.vue'
import Events from './examples/Events.vue'
import ReadOnly from './examples/ReadOnly.vue'
import FormIntegration from './examples/FormIntegration.vue'
// CSS is imported in main.ts

// Current view
type ViewType = 'main' | 'content-types' | 'theme-toolbar' | 'custom-modules' | 'programmatic' | 'events' | 'readonly' | 'forms'
const currentView = ref<ViewType>('main')

// Example 1: Using QuillEditor component with v-model
const content = ref<string>('<p>Hello World!</p>')

// Example 2: Using useEditor composable (TipTap-style)
const { editor } = useEditor({
  content: '<p>This is the composable editor</p>',
  contentType: 'html',
  theme: 'snow',
  onUpdate: ({ editor: e }) => {
    console.log('Content updated:', e.getHTML())
  },
})
</script>

<template>
  <div id="app">
    <header>
      <h1>VueQuill v2.0 Demo</h1>
      <nav>
        <button 
          :class="{ active: currentView === 'main' }"
          @click="currentView = 'main'"
        >
          Main
        </button>
        <button 
          :class="{ active: currentView === 'content-types' }"
          @click="currentView = 'content-types'"
        >
          Content Types
        </button>
        <button 
          :class="{ active: currentView === 'theme-toolbar' }"
          @click="currentView = 'theme-toolbar'"
        >
          Theme
        </button>
        <button 
          :class="{ active: currentView === 'custom-modules' }"
          @click="currentView = 'custom-modules'"
        >
          Modules
        </button>
        <button 
          :class="{ active: currentView === 'programmatic' }"
          @click="currentView = 'programmatic'"
        >
          API
        </button>
        <button 
          :class="{ active: currentView === 'events' }"
          @click="currentView = 'events'"
        >
          Events
        </button>
        <button 
          :class="{ active: currentView === 'readonly' }"
          @click="currentView = 'readonly'"
        >
          Read-Only
        </button>
        <button 
          :class="{ active: currentView === 'forms' }"
          @click="currentView = 'forms'"
        >
          Forms
        </button>
      </nav>
    </header>

    <!-- Content Types Demo -->
    <ContentTypes v-if="currentView === 'content-types'" />

    <!-- Theme & Toolbar Demo -->
    <ThemeToolbar v-else-if="currentView === 'theme-toolbar'" />

    <!-- Custom Modules Demo -->
    <CustomModules v-else-if="currentView === 'custom-modules'" />

    <!-- Programmatic Access Demo -->
    <ProgrammaticAccess v-else-if="currentView === 'programmatic'" />

    <!-- Events Demo -->
    <Events v-else-if="currentView === 'events'" />

    <!-- Read-Only Demo -->
    <ReadOnly v-else-if="currentView === 'readonly'" />

    <!-- Form Integration Demo -->
    <FormIntegration v-else-if="currentView === 'forms'" />

    <!-- Main Demo -->
    <template v-else>
      <section>
        <h2>1. QuillEditor Component (v-model)</h2>
        <QuillEditor
          v-model="content"
          theme="snow"
          toolbar="essential"
          placeholder="Type something..."
          content-type="html"
        />
        <details>
          <summary>Content</summary>
          <pre>{{ content }}</pre>
        </details>
      </section>

      <section>
        <h2>2. useEditor Composable (TipTap-style)</h2>
        <div v-if="editor">
          <div class="toolbar">
            <button @click="editor.chain().bold().run()">Bold</button>
            <button @click="editor.chain().italic().run()">Italic</button>
            <button @click="editor.chain().underline().run()">Underline</button>
            <button @click="editor.chain().setHeading(1).run()">H1</button>
            <button @click="editor.chain().setHeading(2).run()">H2</button>
            <button @click="editor.chain().setBulletList().run()">Bullet List</button>
          </div>
          <EditorContent :editor="editor" />
          <details>
            <summary>HTML Output</summary>
            <pre>{{ editor.getHTML() }}</pre>
          </details>
        </div>
      </section>
    </template>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

header {
  margin-bottom: 30px;
}

h1 {
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

nav {
  display: flex;
  gap: 10px;
}

nav button {
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

nav button:hover {
  background: #e0e0e0;
}

nav button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

section {
  margin: 30px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

h2 {
  margin-top: 0;
  color: #42b983;
}

.toolbar {
  margin-bottom: 10px;
}

.toolbar button {
  margin-right: 5px;
  padding: 5px 10px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.toolbar button:hover {
  background: #369970;
}

details {
  margin-top: 15px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

summary {
  cursor: pointer;
  font-weight: bold;
}

pre {
  margin: 10px 0 0;
  padding: 10px;
  background: #f0f0f0;
  overflow-x: auto;
  font-size: 12px;
}
</style>
