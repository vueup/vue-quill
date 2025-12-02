<script setup lang="ts">
/**
 * Events Demo
 *
 * Demonstrates:
 * - All available editor events
 * - Event payloads and their structure
 * - Both component emit and callback patterns
 */

import { ref, computed } from 'vue'
import { QuillEditor, useEditor, EditorContent } from '@vueup/vue-quill'
import type { Editor as IEditor } from '@vueup/vue-quill'
import type { Delta, EmitterSource, Range } from 'quill'

// ─── Event Log ──────────────────────────────────────────────────────────

interface EventLogEntry {
  id: number
  time: string
  event: string
  details: string
}

const eventLog = ref<EventLogEntry[]>([])
let eventId = 0

function logEvent(event: string, details: Record<string, unknown> = {}) {
  const now = new Date()
  const time = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })

  eventLog.value.unshift({
    id: eventId++,
    time,
    event,
    details: JSON.stringify(details, null, 2),
  })

  // Keep only last 50 events
  if (eventLog.value.length > 50) {
    eventLog.value.pop()
  }
}

function clearLog() {
  eventLog.value = []
}

// ─── Example 1: Component Events ────────────────────────────────────────

const content1 = ref('<p>Type here to see events...</p>')

function handleCreate(payload: { editor: IEditor }) {
  logEvent('@create', {
    isReady: payload.editor.isReady,
    theme: 'snow',
  })
}

function handleUpdate(payload: {
  editor: IEditor
  delta: Delta
  oldDelta: Delta
  source: EmitterSource
}) {
  logEvent('@update', {
    source: payload.source,
    opsCount: payload.delta.ops?.length ?? 0,
    isEmpty: payload.editor.isEmpty,
  })
}

function handleSelectionUpdate(payload: {
  editor: IEditor
  range: Range | null
  oldRange: Range | null
  source: EmitterSource
}) {
  logEvent('@selection-update', {
    range: payload.range,
    oldRange: payload.oldRange,
    source: payload.source,
  })
}

function handleFocus(payload: { editor: IEditor; event: FocusEvent }) {
  logEvent('@focus', {
    isFocused: payload.editor.isFocused,
    type: payload.event.type,
  })
}

function handleBlur(payload: { editor: IEditor; event: FocusEvent }) {
  logEvent('@blur', {
    isFocused: payload.editor.isFocused,
    type: payload.event.type,
  })
}

function handleError(payload: { error: Error }) {
  logEvent('@error', {
    message: payload.error.message,
    name: payload.error.name,
  })
}

// ─── Example 2: Callback Pattern ────────────────────────────────────────

const { editor: composableEditor } = useEditor({
  content: '<p>Callback pattern editor</p>',
  contentType: 'html',
  theme: 'snow',
  onCreate: ({ editor }) => {
    logEvent('onCreate callback', {
      isReady: editor.isReady,
    })
  },
  onUpdate: ({ editor, delta, source }) => {
    logEvent('onUpdate callback', {
      source,
      opsCount: delta.ops?.length ?? 0,
    })
  },
  onSelectionUpdate: ({ range, source }) => {
    logEvent('onSelectionUpdate callback', {
      range,
      source,
    })
  },
  onFocus: ({ editor }) => {
    logEvent('onFocus callback', {
      isFocused: editor.isFocused,
    })
  },
  onBlur: ({ editor }) => {
    logEvent('onBlur callback', {
      isFocused: editor.isFocused,
    })
  },
})

// ─── Example 3: Event Listener Pattern ──────────────────────────────────

const content3 = ref('<p>Editor with dynamic listeners</p>')
const editorRef3 = ref<any>(null)
const listenersActive = ref(false)

function toggleListeners() {
  const editor = editorRef3.value?.editor
  if (!editor) return

  if (listenersActive.value) {
    // Remove listeners
    editor.off('update', dynamicUpdateHandler)
    editor.off('focus', dynamicFocusHandler)
    listenersActive.value = false
    logEvent('Listeners removed', {})
  } else {
    // Add listeners
    editor.on('update', dynamicUpdateHandler)
    editor.on('focus', dynamicFocusHandler)
    listenersActive.value = true
    logEvent('Listeners added', {})
  }
}

function dynamicUpdateHandler(payload: { editor: IEditor }) {
  logEvent('Dynamic update listener', {
    isEmpty: payload.editor.isEmpty,
  })
}

function dynamicFocusHandler(payload: { editor: IEditor }) {
  logEvent('Dynamic focus listener', {
    isFocused: payload.editor.isFocused,
  })
}
</script>

<template>
  <div class="events-demo">
    <h2>Events Demo</h2>
    <p>Monitor all editor events in real-time.</p>

    <div class="layout">
      <!-- Event Examples -->
      <div class="examples">
        <!-- Component Events -->
        <section class="demo-section">
          <h3>1. Component Events (Template)</h3>
          <p>Use <code>@event-name</code> in templates.</p>

          <QuillEditor
            v-model="content1"
            theme="snow"
            toolbar="minimal"
            placeholder="Type here..."
            @create="handleCreate"
            @update="handleUpdate"
            @selection-update="handleSelectionUpdate"
            @focus="handleFocus"
            @blur="handleBlur"
            @error="handleError"
          />

          <details>
            <summary>Event Handler Code</summary>
            <pre>{{ componentEventsCode }}</pre>
          </details>
        </section>

        <!-- Callback Pattern -->
        <section class="demo-section">
          <h3>2. Callback Pattern (useEditor)</h3>
          <p>Pass callbacks to <code>useEditor</code> options.</p>

          <EditorContent v-if="composableEditor" :editor="composableEditor" />

          <details>
            <summary>Callback Code</summary>
            <pre>{{ callbackCode }}</pre>
          </details>
        </section>

        <!-- Dynamic Listeners -->
        <section class="demo-section">
          <h3>3. Dynamic Listeners (on/off)</h3>
          <p>Add and remove listeners programmatically.</p>

          <QuillEditor
            ref="editorRef3"
            v-model="content3"
            theme="snow"
            toolbar="minimal"
            placeholder="Dynamic listeners..."
          />

          <div class="button-group">
            <button @click="toggleListeners">
              {{ listenersActive ? 'Remove Listeners' : 'Add Listeners' }}
            </button>
          </div>

          <div :class="['status', listenersActive ? 'active' : 'inactive']">
            Listeners: {{ listenersActive ? 'Active' : 'Inactive' }}
          </div>

          <details>
            <summary>Dynamic Listener Code</summary>
            <pre>{{ dynamicListenerCode }}</pre>
          </details>
        </section>
      </div>

      <!-- Event Log Panel -->
      <div class="event-log">
        <div class="log-header">
          <h3>Event Log</h3>
          <button @click="clearLog">Clear</button>
        </div>

        <div class="log-entries">
          <div
            v-for="entry in eventLog"
            :key="entry.id"
            class="log-entry"
          >
            <div class="entry-header">
              <span class="entry-time">{{ entry.time }}</span>
              <span class="entry-event">{{ entry.event }}</span>
            </div>
            <pre class="entry-details">{{ entry.details }}</pre>
          </div>

          <div v-if="eventLog.length === 0" class="no-events">
            No events yet. Interact with an editor above.
          </div>
        </div>
      </div>
    </div>

    <!-- Events Reference -->
    <section class="demo-section reference">
      <h3>Events Reference</h3>

      <table class="events-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Payload</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@create</code> / <code>onCreate</code></td>
            <td><code>{ editor }</code></td>
            <td>Fired when editor is initialized</td>
          </tr>
          <tr>
            <td><code>@update</code> / <code>onUpdate</code></td>
            <td><code>{ editor, delta, oldDelta, source }</code></td>
            <td>Fired on any text change</td>
          </tr>
          <tr>
            <td><code>@selection-update</code> / <code>onSelectionUpdate</code></td>
            <td><code>{ editor, range, oldRange, source }</code></td>
            <td>Fired when selection changes</td>
          </tr>
          <tr>
            <td><code>@focus</code> / <code>onFocus</code></td>
            <td><code>{ editor, event }</code></td>
            <td>Fired when editor gains focus</td>
          </tr>
          <tr>
            <td><code>@blur</code> / <code>onBlur</code></td>
            <td><code>{ editor, event }</code></td>
            <td>Fired when editor loses focus</td>
          </tr>
          <tr>
            <td><code>@error</code> / <code>onError</code></td>
            <td><code>{ error }</code></td>
            <td>Fired on initialization errors</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
const componentEventsCode = `<QuillEditor
  v-model="content"
  @create="handleCreate"
  @update="handleUpdate"
  @selection-update="handleSelectionUpdate"
  @focus="handleFocus"
  @blur="handleBlur"
  @error="handleError"
/>

function handleUpdate(payload) {
  const { editor, delta, oldDelta, source } = payload
  console.log('Content changed:', editor.getHTML())
}`

const callbackCode = `const { editor } = useEditor({
  content: '<p>Hello</p>',
  onCreate: ({ editor }) => {
    console.log('Editor ready')
  },
  onUpdate: ({ editor, delta, source }) => {
    console.log('Changed by:', source)
  },
  onSelectionUpdate: ({ range }) => {
    console.log('Selection:', range)
  },
  onFocus: () => {
    console.log('Focused')
  },
  onBlur: () => {
    console.log('Blurred')
  },
})`

const dynamicListenerCode = `// Add listener
editor.on('update', (payload) => {
  console.log('Text changed')
})

// Remove listener
editor.off('update', handler)

// Available events:
// 'create', 'update', 'selectionUpdate', 
// 'focus', 'blur', 'destroy', 'transaction'`

export { componentEventsCode, callbackCode, dynamicListenerCode }
</script>

<style scoped>
.events-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.demo-section {
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

.demo-section code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.button-group {
  margin-top: 12px;
}

.button-group button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button-group button:hover {
  background: #1565c0;
}

.status {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.status.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.inactive {
  background: #fbe9e7;
  color: #bf360c;
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

details pre {
  margin: 12px 0 0 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  white-space: pre-wrap;
}

/* Event Log */
.event-log {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #1976d2;
  color: white;
}

.log-header h3 {
  margin: 0;
  font-size: 16px;
}

.log-header button {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.log-header button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.log-entries {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background: #f5f5f5;
}

.log-entry {
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 4px;
  border-left: 3px solid #1976d2;
}

.entry-header {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.entry-time {
  font-size: 11px;
  color: #888;
  font-family: monospace;
}

.entry-event {
  font-weight: 600;
  color: #1976d2;
  font-size: 13px;
}

.entry-details {
  margin: 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
}

.no-events {
  padding: 20px;
  text-align: center;
  color: #888;
  font-style: italic;
}

/* Reference */
.reference {
  margin-top: 20px;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.events-table th,
.events-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.events-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.events-table code {
  background: #e8e8e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}
</style>
