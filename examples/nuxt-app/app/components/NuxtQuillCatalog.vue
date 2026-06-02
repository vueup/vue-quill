<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { Delta, QuillEditor } from '@vueup/vue-quill'
import ExampleCard from '@vue-quill-example/components/ExampleCard.vue'
import EventLog from '@vue-quill-example/components/EventLog.vue'
import {
  exampleSections,
  requiredCoverage,
  themeExamples,
  toolbarExamples,
  type ExampleSectionId,
  type ThemeValue,
  type ToolbarValue,
} from '@vue-quill-example/example-catalog'

type EditorExpose = ComponentPublicInstance & {
  focus: () => void
  getHTML: () => string
  setHTML: (html: string) => void
}

type EventItem = {
  id: number
  name: string
  detail: string
  source: string
}

type TextChangePayload = {
  delta: Delta
  source: string
}

type SelectionChangePayload = {
  range: { index: number; length: number } | null
  source: string
}

type EditorChangePayload = {
  name: string
  source?: string
}

type WordCounterMetrics = {
  words: number
  characters: number
}

type WordCounterOptions = {
  onUpdate?: (metrics: WordCounterMetrics) => void
}

type WordCounterQuill = {
  getText: () => string
  on: (eventName: 'text-change', handler: () => void) => void
}

class WordCounterModule {
  constructor(quill: WordCounterQuill, options: WordCounterOptions = {}) {
    const update = () => {
      const text = quill.getText().replace(/\s+/g, ' ').trim()
      options.onUpdate?.({
        words: text ? text.split(' ').length : 0,
        characters: text.length,
      })
    }

    quill.on('text-change', update)
    update()
  }
}

const getSection = (id: ExampleSectionId) => {
  const section = exampleSections.find((item) => item.id === id)
  if (!section) throw new Error(`Missing Vue Quill example section: ${id}`)
  return section
}

const basicSection = getSection('basic')
const modelSection = getSection('model')
const toolbarSection = getSection('toolbars')
const modulesSection = getSection('modules')
const themesSection = getSection('themes')
const readOnlySection = getSection('read-only')
const eventsSection = getSection('events')
const realWorldSection = getSection('real-world')

const basicContent = new Delta()
  .insert('VueQuill starts with a simple component import.\n', { bold: true })
  .insert(
    'Use Delta content for robust editing state and HTML when you need previews.',
  )

const modelEditor = shallowRef<EditorExpose>()
const modelContent = ref(
  '<h2>Launch checklist</h2><p>Draft release notes, confirm screenshots, and send the publishing brief.</p>',
)
const methodResult = ref(
  'Use the buttons to call focus(), setHTML(), or getHTML().',
)

const activeToolbarId = ref<(typeof toolbarExamples)[number]['id']>('minimal')
const toolbarContent = ref(
  '<h3>Toolbar configuration</h3><p>Switch the toolbar selector to compare supported customization approaches.</p>',
)
const activeToolbar = computed<ToolbarValue>(() => {
  return (
    toolbarExamples.find((toolbar) => toolbar.id === activeToolbarId.value)
      ?.toolbar ?? 'minimal'
  )
})
const activeToolbarDescription = computed(() => {
  return toolbarExamples.find((toolbar) => toolbar.id === activeToolbarId.value)
    ?.description
})

const moduleContent = ref(
  '<h3>Release notes</h3><p>Custom modules can observe the editor and receive options from each Vue component instance.</p>',
)
const moduleMetrics = ref<WordCounterMetrics>({ words: 0, characters: 0 })
const wordCounterModule = {
  name: 'wordCounter',
  module: WordCounterModule,
  options: {
    onUpdate: (metrics: WordCounterMetrics) => {
      moduleMetrics.value = metrics
    },
  },
}

const activeTheme = ref<ThemeValue>('snow')
const themedContent = ref(
  '<p>Select a theme to see how the same content renders with Snow, Bubble, or core styling.</p>',
)

const editableEnabled = ref(true)
const readonlyContent = ref(
  '<h3>Approved policy note</h3><p>This instance is read-only and cannot be changed by the user.</p>',
)
const readonlyOptions = {
  modules: {
    toolbar: false,
  },
}
const enableContent = ref(
  '<p>The enable prop is useful when temporarily disabling editing during save or review flows.</p>',
)

const eventContent = ref(
  new Delta().insert(
    'Type here, select text, focus, or blur to populate the event log.',
  ),
)
const eventLog = ref<EventItem[]>([])
let nextEventId = 1

const formContent = ref(
  '<p>We shipped a focused Vue Quill example with local development aliases and npm production builds.</p>',
)
const submittedContent = ref('')

const plainFormText = computed(() => {
  return formContent.value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
})
const formIsReady = computed(() => plainFormText.value.length >= 80)
const formStatus = computed(() => {
  if (submittedContent.value) return 'Saved draft content for submission.'
  return formIsReady.value
    ? 'Draft is ready to submit.'
    : 'Write at least 80 plain-text characters.'
})

const coverageSummary = computed(() => {
  return `${exampleSections.length} sections cover ${requiredCoverage.length} public usage patterns.`
})

const recordEvent = (name: string, detail: string, source = 'api') => {
  eventLog.value.unshift({
    id: nextEventId,
    name,
    detail,
    source,
  })
  nextEventId += 1
  eventLog.value = eventLog.value.slice(0, 8)
}

const describeRange = (range: SelectionChangePayload['range']) => {
  if (!range) return 'No active selection'
  return `index ${range.index}, length ${range.length}`
}

const handleReady = () => {
  recordEvent('ready', 'Quill instance initialized')
}

const handleFocus = () => {
  recordEvent('focus', 'Editor focused', 'user')
}

const handleBlur = () => {
  recordEvent('blur', 'Editor blurred', 'user')
}

const handleTextChange = ({ delta, source }: TextChangePayload) => {
  recordEvent('textChange', `${delta.ops.length} delta operation(s)`, source)
}

const handleSelectionChange = ({ range, source }: SelectionChangePayload) => {
  recordEvent('selectionChange', describeRange(range), source)
}

const handleEditorChange = ({ name, source = 'api' }: EditorChangePayload) => {
  recordEvent('editorChange', name, source)
}

const focusModelEditor = () => {
  modelEditor.value?.focus()
  methodResult.value = 'focus() called on the v-model editor.'
}

const insertTemplateWithMethod = () => {
  modelEditor.value?.setHTML(
    '<h2>Editorial plan</h2><ol><li>Write draft</li><li>Review tone</li><li>Publish update</li></ol>',
  )
  modelContent.value = modelEditor.value?.getHTML() ?? modelContent.value
  methodResult.value =
    'setHTML() replaced the editor body and synced v-model content.'
}

const readHtmlWithMethod = () => {
  const html = modelEditor.value?.getHTML() ?? ''
  methodResult.value = `getHTML() returned ${html.length} characters.`
}

const setToolbarExample = (
  toolbarId: (typeof toolbarExamples)[number]['id'],
) => {
  activeToolbarId.value = toolbarId
}

const setThemeExample = (theme: ThemeValue) => {
  activeTheme.value = theme
}

const toggleEditable = () => {
  editableEnabled.value = !editableEnabled.value
}

const resetEventLog = () => {
  eventLog.value = []
}

const submitContent = () => {
  if (!formIsReady.value) return
  submittedContent.value = formContent.value
}
</script>

<template>
  <main class="app-shell" data-testid="nuxt-catalog">
    <header class="app-header">
      <div>
        <p class="app-header__label">VueQuill + Nuxt</p>
        <h1>Comprehensive Vue Quill examples</h1>
        <p>
          A Nuxt app showing editor setup, content binding, toolbar strategies,
          themes, read-only states, events, refs, form usage, and Nuxt rendering
          modes.
        </p>
      </div>
      <aside class="coverage-panel" aria-label="Example coverage">
        <strong>{{ coverageSummary }}</strong>
        <ul>
          <li v-for="item in requiredCoverage" :key="item">
            {{ item }}
          </li>
        </ul>
      </aside>
    </header>

    <section class="section-index" aria-label="Example sections">
      <a
        v-for="section in exampleSections"
        :key="section.id"
        :href="`#${section.id}`"
      >
        <strong>{{ section.title }}</strong>
        <span>{{ section.coverage.join(', ') }}</span>
      </a>
    </section>

    <div class="example-grid">
      <ExampleCard
        id="basic"
        :title="basicSection.title"
        :description="basicSection.description"
      >
        <QuillEditor
          theme="snow"
          toolbar="minimal"
          placeholder="Write a short product update..."
          :content="basicContent"
        />
        <p class="code-note">
          <code>&lt;QuillEditor theme="snow" toolbar="minimal" /&gt;</code>
        </p>
      </ExampleCard>

      <ExampleCard
        id="model"
        :title="modelSection.title"
        :description="modelSection.description"
      >
        <div class="split-panel">
          <div>
            <QuillEditor
              ref="modelEditor"
              v-model:content="modelContent"
              content-type="html"
              theme="snow"
              toolbar="essential"
              placeholder="Plan the launch..."
            />
            <div class="button-row">
              <button type="button" @click="focusModelEditor">
                Focus editor
              </button>
              <button type="button" @click="insertTemplateWithMethod">
                Insert template
              </button>
              <button type="button" @click="readHtmlWithMethod">
                Read HTML
              </button>
            </div>
            <p class="method-result">
              {{ methodResult }}
            </p>
          </div>
          <div class="preview-panel">
            <h3>Live HTML preview</h3>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="modelContent" />
          </div>
        </div>
      </ExampleCard>

      <ExampleCard
        id="toolbars"
        :title="toolbarSection.title"
        :description="toolbarSection.description"
      >
        <div class="segmented-control" role="group" aria-label="Toolbar type">
          <button
            v-for="toolbar in toolbarExamples"
            :key="toolbar.id"
            type="button"
            :class="{ 'is-active': activeToolbarId === toolbar.id }"
            @click="setToolbarExample(toolbar.id)"
          >
            {{ toolbar.label }}
          </button>
        </div>
        <p class="helper-text">
          {{ activeToolbarDescription }}
        </p>
        <QuillEditor
          :key="activeToolbarId"
          v-model:content="toolbarContent"
          content-type="html"
          theme="snow"
          :toolbar="activeToolbar"
          placeholder="Customize the toolbar for your writing workflow..."
        >
          <template v-if="activeToolbarId === 'custom-container'" #toolbar>
            <div id="article-toolbar" class="custom-toolbar">
              <button class="ql-bold" type="button" aria-label="Bold" />
              <button class="ql-italic" type="button" aria-label="Italic" />
              <button
                class="ql-underline"
                type="button"
                aria-label="Underline"
              />
              <select class="ql-header" aria-label="Heading">
                <option value="2">Heading</option>
                <option value="3">Subheading</option>
                <option selected />
              </select>
              <button class="ql-link" type="button" aria-label="Link" />
              <button
                class="ql-clean"
                type="button"
                aria-label="Clear formatting"
              />
            </div>
          </template>
        </QuillEditor>
      </ExampleCard>

      <ExampleCard
        id="modules"
        :title="modulesSection.title"
        :description="modulesSection.description"
      >
        <div class="split-panel split-panel--compact">
          <div class="editor-stack">
            <QuillEditor
              v-model:content="moduleContent"
              content-type="html"
              theme="snow"
              toolbar="minimal"
              :modules="wordCounterModule"
              placeholder="Edit content to update custom module metrics..."
            />
          </div>
          <div class="preview-panel metrics-panel">
            <h3>Module output</h3>
            <dl>
              <div>
                <dt>Words</dt>
                <dd>{{ moduleMetrics.words }}</dd>
              </div>
              <div>
                <dt>Characters</dt>
                <dd>{{ moduleMetrics.characters }}</dd>
              </div>
            </dl>
            <p>
              The module is registered as <code>modules/wordCounter</code> and
              receives an <code>onUpdate</code> option.
            </p>
          </div>
        </div>
      </ExampleCard>

      <ExampleCard
        id="themes"
        :title="themesSection.title"
        :description="themesSection.description"
      >
        <div class="theme-list">
          <button
            v-for="theme in themeExamples"
            :key="theme.label"
            type="button"
            :class="{ 'is-active': activeTheme === theme.value }"
            @click="setThemeExample(theme.value)"
          >
            <strong>{{ theme.label }}</strong>
            <span>{{ theme.description }}</span>
          </button>
        </div>
        <QuillEditor
          :key="activeTheme || 'core'"
          v-model:content="themedContent"
          content-type="html"
          :theme="activeTheme"
          toolbar="minimal"
          placeholder="Theme-specific placeholder copy..."
        />
      </ExampleCard>

      <ExampleCard
        id="read-only"
        :title="readOnlySection.title"
        :description="readOnlySection.description"
      >
        <div class="split-panel split-panel--compact">
          <div>
            <h3>Read-only article</h3>
            <QuillEditor
              v-model:content="readonlyContent"
              content-type="html"
              theme="snow"
              read-only
              :options="readonlyOptions"
            />
          </div>
          <div>
            <div class="inline-switch">
              <span>Enable input</span>
              <button
                type="button"
                :class="{ 'is-active': editableEnabled }"
                @click="toggleEditable"
              >
                {{ editableEnabled ? 'On' : 'Off' }}
              </button>
            </div>
            <QuillEditor
              v-model:content="enableContent"
              content-type="html"
              theme="snow"
              toolbar="minimal"
              :enable="editableEnabled"
            />
          </div>
        </div>
      </ExampleCard>

      <ExampleCard
        id="events"
        :title="eventsSection.title"
        :description="eventsSection.description"
      >
        <div class="split-panel split-panel--events">
          <div class="editor-stack">
            <QuillEditor
              v-model:content="eventContent"
              theme="snow"
              toolbar="minimal"
              placeholder="Trigger editor events..."
              @ready="handleReady"
              @focus="handleFocus"
              @blur="handleBlur"
              @text-change="handleTextChange"
              @selection-change="handleSelectionChange"
              @editor-change="handleEditorChange"
            />
          </div>
          <div class="event-panel">
            <div class="event-panel__header">
              <h3>Latest events</h3>
              <button type="button" @click="resetEventLog">Clear</button>
            </div>
            <EventLog :events="eventLog" />
          </div>
        </div>
      </ExampleCard>

      <ExampleCard
        id="real-world"
        :title="realWorldSection.title"
        :description="realWorldSection.description"
      >
        <form class="form-example" @submit.prevent="submitContent">
          <label for="post-title">Post title</label>
          <input id="post-title" value="Release note draft" />
          <label>Post body</label>
          <div class="editor-stack">
            <QuillEditor
              v-model:content="formContent"
              content-type="html"
              theme="snow"
              toolbar="essential"
              placeholder="Write the release note body..."
            />
          </div>
          <div class="form-footer">
            <span>{{ plainFormText.length }} plain-text characters</span>
            <button type="submit" :disabled="!formIsReady">Submit draft</button>
          </div>
          <p class="method-result">
            {{ formStatus }}
          </p>
        </form>
        <div
          v-if="submittedContent"
          class="preview-panel preview-panel--submitted"
        >
          <h3>Submitted HTML</h3>
          <code>{{ submittedContent }}</code>
        </div>
      </ExampleCard>
    </div>
  </main>
</template>
