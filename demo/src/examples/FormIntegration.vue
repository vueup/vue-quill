<script setup lang="ts">
/**
 * Form Integration Demo
 *
 * Demonstrates:
 * - Using VueQuill with form libraries
 * - v-model integration patterns
 * - Blur events for touched state
 * - Name prop for form field identification
 */

import { ref, computed } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

// ─── Example 1: Basic Form ──────────────────────────────────────────────

const formData = ref({
  title: '',
  content: '',
  category: 'general',
})

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})

function validateField(field: string) {
  const value = formData.value[field as keyof typeof formData.value]
  
  switch (field) {
    case 'title':
      if (!value || String(value).trim() === '') {
        errors.value.title = 'Title is required'
      } else if (String(value).length < 3) {
        errors.value.title = 'Title must be at least 3 characters'
      } else {
        delete errors.value.title
      }
      break
    case 'content':
      // Strip HTML to get text length
      const textContent = String(value).replace(/<[^>]*>/g, '').trim()
      if (!textContent) {
        errors.value.content = 'Content is required'
      } else if (textContent.length < 10) {
        errors.value.content = 'Content must be at least 10 characters'
      } else {
        delete errors.value.content
      }
      break
  }
}

function handleBlur(field: string) {
  touched.value[field] = true
  validateField(field)
}

function handleSubmit() {
  // Touch all fields
  touched.value.title = true
  touched.value.content = true
  
  // Validate all
  validateField('title')
  validateField('content')
  
  // Check for errors
  if (Object.keys(errors.value).length === 0) {
    alert('Form submitted!\n\n' + JSON.stringify(formData.value, null, 2))
  }
}

function resetForm() {
  formData.value = {
    title: '',
    content: '',
    category: 'general',
  }
  errors.value = {}
  touched.value = {}
}

// ─── Example 2: Character Counter ───────────────────────────────────────

const commentContent = ref('')
const maxChars = 500

const charCount = computed(() => {
  return commentContent.value.replace(/<[^>]*>/g, '').length
})

const charsRemaining = computed(() => {
  return maxChars - charCount.value
})

const isOverLimit = computed(() => {
  return charCount.value > maxChars
})

// ─── Example 3: Required Field Pattern ──────────────────────────────────

const requiredContent = ref('')
const isRequired = ref(true)
const fieldTouched = ref(false)

const showError = computed(() => {
  if (!isRequired.value) return false
  if (!fieldTouched.value) return false
  const text = requiredContent.value.replace(/<[^>]*>/g, '').trim()
  return text.length === 0
})
</script>

<template>
  <div class="form-demo">
    <h2>Form Integration</h2>
    <p>Use VueQuill in forms with validation and state tracking.</p>

    <!-- Basic Form -->
    <section class="demo-section">
      <h3>1. Basic Form with Validation</h3>
      <p>A complete form example with validation on blur.</p>

      <form class="form" @submit.prevent="handleSubmit">
        <!-- Title Field -->
        <div class="form-field">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Enter title..."
            @blur="handleBlur('title')"
          />
          <span v-if="touched.title && errors.title" class="error">
            {{ errors.title }}
          </span>
        </div>

        <!-- Category Field -->
        <div class="form-field">
          <label for="category">Category</label>
          <select id="category" v-model="formData.category">
            <option value="general">General</option>
            <option value="tech">Technology</option>
            <option value="news">News</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>

        <!-- Content Field (VueQuill) -->
        <div class="form-field">
          <label>Content</label>
          <QuillEditor
            v-model="formData.content"
            theme="snow"
            toolbar="essential"
            content-type="html"
            placeholder="Write your content..."
            @blur="handleBlur('content')"
          />
          <span v-if="touched.content && errors.content" class="error">
            {{ errors.content }}
          </span>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="primary">Submit</button>
          <button type="button" @click="resetForm">Reset</button>
        </div>
      </form>

      <details open>
        <summary>Form Data</summary>
        <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
      </details>
    </section>

    <!-- Character Counter -->
    <section class="demo-section">
      <h3>2. Character Counter</h3>
      <p>Limit content length with a character counter.</p>

      <div class="form-field">
        <label>Comment (max {{ maxChars }} characters)</label>
        <QuillEditor
          v-model="commentContent"
          theme="snow"
          toolbar="minimal"
          content-type="html"
          placeholder="Write your comment..."
        />
        <div :class="['char-counter', { over: isOverLimit }]">
          {{ charCount }} / {{ maxChars }} characters
          <span v-if="isOverLimit">
            ({{ Math.abs(charsRemaining) }} over limit)
          </span>
        </div>
      </div>
    </section>

    <!-- Required Field -->
    <section class="demo-section">
      <h3>3. Required Field Pattern</h3>
      <p>Show validation error when field is empty after blur.</p>

      <div class="form-field">
        <label class="toggle-label">
          <input v-model="isRequired" type="checkbox" />
          <span>Required field</span>
        </label>
      </div>

      <div class="form-field">
        <label>
          Description
          <span v-if="isRequired" class="required-mark">*</span>
        </label>
        <QuillEditor
          v-model="requiredContent"
          theme="snow"
          toolbar="minimal"
          content-type="html"
          placeholder="Enter description..."
          @blur="fieldTouched = true"
        />
        <span v-if="showError" class="error">
          Description is required
        </span>
      </div>
    </section>

    <!-- Integration Patterns -->
    <section class="demo-section">
      <h3>Form Library Integration</h3>
      <p>VueQuill works with popular form libraries through its standard v-model interface.</p>

      <h4>VeeValidate Example</h4>
      <pre>{{ veeValidateCode }}</pre>

      <h4>FormKit Example</h4>
      <pre>{{ formkitCode }}</pre>

      <h4>Key Integration Points</h4>
      <ul class="integration-list">
        <li>
          <strong>v-model:</strong> Standard Vue v-model for form binding
        </li>
        <li>
          <strong>@blur:</strong> Emitted when editor loses focus (for touched state)
        </li>
        <li>
          <strong>@update:</strong> Emitted on every content change (for real-time validation)
        </li>
        <li>
          <strong>content-type:</strong> Choose "html" for most form scenarios
        </li>
        <li>
          <strong>editable:</strong> Disable editor when form is submitting
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
const veeValidateCode = `<template>
  <Field name="content" v-slot="{ field, errors, meta }">
    <QuillEditor
      v-bind="field"
      theme="snow"
      toolbar="essential"
      content-type="html"
      placeholder="Write content..."
    />
    <span v-if="meta.touched && errors.length">
      {{ errors[0] }}
    </span>
  </Field>
</template>

<script setup>
import { useField } from 'vee-validate'

// With Composition API
const { value, errorMessage, meta } = useField('content', validateContent)
<\/script>`

const formkitCode = `<template>
  <FormKit type="form" @submit="handleSubmit">
    <FormKit
      type="text"
      name="title"
      label="Title"
      validation="required"
    />
    
    <!-- Custom input for QuillEditor -->
    <FormKit
      type="quill"
      name="content"
      label="Content"
      validation="required"
    />
  </FormKit>
</template>

<script setup>
// Register custom FormKit input
import { createInput } from '@formkit/vue'
import { QuillEditor } from '@vueup/vue-quill'

const quillInput = createInput(QuillEditor, {
  props: ['theme', 'toolbar', 'contentType'],
})
<\/script>`

export { veeValidateCode, formkitCode }
</script>

<style scoped>
.form-demo {
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

.demo-section h4 {
  margin-top: 24px;
  margin-bottom: 12px;
  color: #555;
}

.demo-section p {
  color: #666;
  margin-bottom: 16px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  font-weight: 500;
  color: #333;
}

.form-field input[type="text"],
.form-field select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-field input[type="text"]:focus,
.form-field select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.error {
  color: #d32f2f;
  font-size: 13px;
}

.required-mark {
  color: #d32f2f;
}

.form-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-actions button.primary {
  background: #1976d2;
  color: white;
}

.form-actions button.primary:hover {
  background: #1565c0;
}

.form-actions button:not(.primary) {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.form-actions button:not(.primary):hover {
  background: #e0e0e0;
}

.char-counter {
  font-size: 13px;
  color: #666;
  text-align: right;
}

.char-counter.over {
  color: #d32f2f;
  font-weight: 500;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.toggle-label input {
  width: 16px;
  height: 16px;
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
  font-size: 12px;
  white-space: pre-wrap;
  overflow-x: auto;
}

.integration-list {
  margin: 0;
  padding-left: 20px;
}

.integration-list li {
  margin-bottom: 12px;
  color: #555;
}

.integration-list strong {
  color: #333;
}
</style>
