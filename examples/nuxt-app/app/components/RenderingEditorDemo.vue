<script setup lang="ts">
import { computed, ref } from 'vue'
import { Delta, QuillEditor } from '@vueup/vue-quill'

const props = defineProps<{
  eyebrow: string
  title: string
  description: string
  strategy: string
}>()

const deltaContent = ref(
  new Delta()
    .insert(`${props.strategy} route verified.\n`, { bold: true })
    .insert(
      'Quill is loaded only in the browser after the Nuxt page hydrates.',
    ),
)
const htmlContent = ref(
  `<p>${props.strategy} rendering keeps the page shell stable while VueQuill initializes on the client.</p>`,
)
const editorReady = ref(false)

const readyLabel = computed(() => (editorReady.value ? 'yes' : 'waiting'))
</script>

<template>
  <main class="app-shell rendering-page" :data-strategy="strategy">
    <header class="app-header app-header--single">
      <div>
        <p class="app-header__label">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
    </header>

    <section class="status-panel" aria-label="Rendering status">
      <h2>Rendering status</h2>
      <p data-testid="rendering-status">
        Nuxt strategy: <strong>{{ strategy }}</strong>
      </p>
      <p data-testid="ready-status">
        Editor ready: <strong>{{ readyLabel }}</strong>
      </p>
    </section>

    <section class="rendering-grid" aria-label="VueQuill rendering examples">
      <article class="example-card">
        <div class="example-card__header">
          <h2>Delta editor</h2>
          <p>
            Initialized from Delta content and hydrated after the Nuxt page is
            delivered.
          </p>
        </div>
        <div class="editor-stack">
          <QuillEditor
            v-model:content="deltaContent"
            theme="snow"
            toolbar="minimal"
            placeholder="Hydrated Delta editor..."
            @ready="editorReady = true"
          />
        </div>
      </article>

      <article class="example-card">
        <div class="example-card__header">
          <h2>HTML editor</h2>
          <p>
            Demonstrates HTML content initialization in the same rendering mode.
          </p>
        </div>
        <div class="editor-stack">
          <QuillEditor
            v-model:content="htmlContent"
            content-type="html"
            theme="snow"
            toolbar="essential"
            placeholder="Hydrated HTML editor..."
          />
        </div>
      </article>
    </section>
  </main>
</template>
