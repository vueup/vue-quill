# Vitest Configuration for Vue 3 Component Library Testing

## Overview

This document provides comprehensive research on setting up Vitest for testing Vue 3 component libraries, with specific focus on the vue-quill project requirements.

## Table of Contents

1. [Complete vitest.config.ts Example](#complete-vitestconfigts-example)
2. [Vue Test Utils Integration](#vue-test-utils-integration)
3. [Testing Components with defineModel, defineProps, defineEmits](#testing-components-with-definemodel-defineprops-defineemits)
4. [Mocking External Dependencies (Quill)](#mocking-external-dependencies-quill)
5. [Coverage Configuration](#coverage-configuration)
6. [Snapshot Testing](#snapshot-testing)
7. [Testing Composables](#testing-composables)
8. [Test File Structure](#test-file-structure)
9. [Best Practices](#best-practices)

---

## Complete vitest.config.ts Example

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'packages/vue-quill/src'),
      '@tests': resolve(__dirname, 'tests'),
    },
  },
  
  test: {
    // Test file patterns
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx,vue}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/demo/**',
      '**/docs/**',
      '**/examples/**',
    ],

    // Environment - jsdom for Vue component testing
    environment: 'jsdom',
    
    // Global test APIs (describe, it, expect, vi)
    globals: true,

    // Execution settings
    pool: 'forks',
    fileParallelism: true,
    testTimeout: 10000,
    hookTimeout: 10000,

    // Setup files - runs before each test file
    setupFiles: ['./tests/setup.ts'],
    
    // Global setup - runs once before all tests
    // globalSetup: ['./tests/global-setup.ts'],

    // Reporters
    reporters: ['default', 'html'],
    outputFile: {
      html: './coverage/test-report/index.html',
    },

    // Coverage configuration
    coverage: {
      provider: 'v8',
      enabled: false, // Enable via CLI: vitest --coverage
      reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      
      // Include source files
      include: [
        'packages/vue-quill/src/**/*.{ts,vue}',
      ],
      
      // Exclude from coverage
      exclude: [
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/index.ts', // Re-export files
        '**/types/**',
        '**/shims-vue.d.ts',
      ],
      
      // Coverage thresholds
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
      
      // Fail CI if coverage drops below thresholds
      // thresholds: {
      //   '100': true, // 100% coverage required
      // },
    },

    // Mocking behavior
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,

    // Snapshot settings
    snapshotFormat: {
      printBasicPrototype: false,
    },

    // Sequencing
    sequence: {
      shuffle: false,
      concurrent: false,
      hooks: 'stack',
    },

    // Type checking (optional, can slow down tests)
    // typecheck: {
    //   enabled: true,
    //   checker: 'vue-tsc',
    // },

    // CSS handling
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },

    // Dependencies to inline (important for Vue components)
    deps: {
      inline: [
        /vue/,
        /@vue/,
      ],
    },
  },
})
```

---

## Vue Test Utils Integration

### Installation

```bash
pnpm add -D vitest @vue/test-utils @vitejs/plugin-vue jsdom happy-dom
pnpm add -D @vitest/coverage-v8
```

### Setup File (tests/setup.ts)

```typescript
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global components registration
// config.global.components = {}

// Global plugins
// config.global.plugins = []

// Global mocks applied to all tests
config.global.mocks = {
  // Add any global mocks here
  // $t: (key: string) => key, // i18n mock
}

// Global stubs for heavy external components
config.global.stubs = {
  // Stub transition components for faster tests
  Transition: false,
  TransitionGroup: false,
}

// Reset DOM between tests
beforeEach(() => {
  document.body.innerHTML = ''
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock MutationObserver if needed
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

### Basic Component Mount Example

```typescript
import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(MyComponent, {
      props: {
        initialValue: 'test',
      },
      global: {
        plugins: [],
        mocks: {},
        stubs: {},
        provide: {},
      },
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('displays initial value', () => {
    expect(wrapper.text()).toContain('test')
  })
})
```

---

## Testing Components with defineModel, defineProps, defineEmits

### Testing defineProps

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Counter from '@/components/Counter.vue'

// Component with defineProps
// <script setup>
// const props = defineProps<{
//   initialCount: number
//   step?: number
// }>()
// </script>

describe('Counter with defineProps', () => {
  it('receives props correctly', () => {
    const wrapper = mount(Counter, {
      props: {
        initialCount: 10,
        step: 5,
      },
    })

    // Access all props
    expect(wrapper.props()).toEqual({
      initialCount: 10,
      step: 5,
    })

    // Access specific prop
    expect(wrapper.props('initialCount')).toBe(10)
    expect(wrapper.props('step')).toBe(5)
  })

  it('uses default prop values', () => {
    const wrapper = mount(Counter, {
      props: {
        initialCount: 0,
        // step not provided, should use default
      },
    })

    expect(wrapper.props('initialCount')).toBe(0)
    // step would use its default value
  })
})
```

### Testing defineEmits

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Counter from '@/components/Counter.vue'

// Component with defineEmits
// <script setup>
// const emit = defineEmits<{
//   increment: [count: number]
//   decrement: [count: number]
//   change: [value: number, previous: number]
// }>()
// </script>

describe('Counter with defineEmits', () => {
  it('emits increment event with payload', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 0 },
    })

    await wrapper.find('[data-test="increment-btn"]').trigger('click')

    // Check event was emitted
    expect(wrapper.emitted()).toHaveProperty('increment')
    
    // Check emission count
    expect(wrapper.emitted('increment')).toHaveLength(1)
    
    // Check event payload
    expect(wrapper.emitted('increment')![0]).toEqual([1])
  })

  it('emits multiple events in order', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 5 },
    })

    await wrapper.find('[data-test="increment-btn"]').trigger('click')
    await wrapper.find('[data-test="increment-btn"]').trigger('click')

    const increments = wrapper.emitted('increment')
    expect(increments).toHaveLength(2)
    expect(increments![0]).toEqual([6])
    expect(increments![1]).toEqual([7])
  })

  it('emits complex event payload', async () => {
    const wrapper = mount(Counter, {
      props: { initialCount: 10 },
    })

    await wrapper.find('[data-test="change-btn"]').trigger('click')

    expect(wrapper.emitted('change')![0]).toEqual([
      { count: 11, isEven: false },
    ])
  })
})
```

### Testing defineModel (Vue 3.4+)

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import TextInput from '@/components/TextInput.vue'

// Component with defineModel
// <script setup>
// const modelValue = defineModel<string>({ required: true })
// const count = defineModel<number>('count', { default: 0 })
// </script>

describe('TextInput with defineModel', () => {
  it('syncs with v-model', async () => {
    const modelValue = ref('initial')
    
    const wrapper = mount(TextInput, {
      props: {
        modelValue: modelValue.value,
        'onUpdate:modelValue': (val: string) => {
          modelValue.value = val
        },
      },
    })

    // Simulate input
    await wrapper.find('input').setValue('new value')

    // Check emit was called
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['new value'])
  })

  it('handles named model', async () => {
    const wrapper = mount(TextInput, {
      props: {
        modelValue: 'text',
        count: 5,
        'onUpdate:count': vi.fn(),
      },
    })

    expect(wrapper.props('count')).toBe(5)
    
    // Trigger count update
    await wrapper.find('[data-test="increment"]').trigger('click')
    
    expect(wrapper.emitted('update:count')![0]).toEqual([6])
  })

  it('works with parent component', async () => {
    const Parent = {
      components: { TextInput },
      template: '<TextInput v-model="text" />',
      setup() {
        const text = ref('hello')
        return { text }
      },
    }

    const wrapper = mount(Parent)
    const input = wrapper.findComponent(TextInput)

    await input.find('input').setValue('world')
    await nextTick()

    expect(wrapper.vm.text).toBe('world')
  })
})
```

---

## Mocking External Dependencies (Quill)

### Mock File (tests/mocks/quill.ts)

```typescript
import { vi } from 'vitest'
import type { QuillOptionsStatic, RangeStatic, Sources } from 'quill'

// Create a mock Quill class
export const createMockQuill = () => {
  const handlers: Record<string, Function[]> = {}

  return {
    // Core methods
    getContents: vi.fn(() => ({ ops: [] })),
    setContents: vi.fn(),
    getText: vi.fn(() => ''),
    setText: vi.fn(),
    getHTML: vi.fn(() => ''),
    getLength: vi.fn(() => 0),
    getSelection: vi.fn(() => ({ index: 0, length: 0 })),
    setSelection: vi.fn(),
    getBounds: vi.fn(() => ({ left: 0, top: 0, height: 0, width: 0 })),
    
    // Editor state
    hasFocus: vi.fn(() => false),
    focus: vi.fn(),
    blur: vi.fn(),
    enable: vi.fn(),
    disable: vi.fn(),
    
    // Formatting
    format: vi.fn(),
    formatText: vi.fn(),
    formatLine: vi.fn(),
    getFormat: vi.fn(() => ({})),
    removeFormat: vi.fn(),
    
    // Content manipulation
    insertText: vi.fn(),
    insertEmbed: vi.fn(),
    deleteText: vi.fn(),
    updateContents: vi.fn(),
    
    // Undo/Redo
    history: {
      undo: vi.fn(),
      redo: vi.fn(),
      clear: vi.fn(),
    },
    
    // Modules
    getModule: vi.fn((name: string) => {
      if (name === 'toolbar') {
        return {
          container: {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          },
        }
      }
      if (name === 'history') {
        return {
          undo: vi.fn(),
          redo: vi.fn(),
        }
      }
      return null
    }),
    
    // Event handling
    on: vi.fn((event: string, handler: Function) => {
      if (!handlers[event]) handlers[event] = []
      handlers[event].push(handler)
    }),
    off: vi.fn((event: string, handler: Function) => {
      if (handlers[event]) {
        handlers[event] = handlers[event].filter(h => h !== handler)
      }
    }),
    once: vi.fn(),
    
    // Clipboard
    clipboard: {
      dangerouslyPasteHTML: vi.fn(),
    },
    
    // Scroll
    scrollIntoView: vi.fn(),
    
    // Root element
    root: document.createElement('div'),
    container: document.createElement('div'),
    
    // Helper to trigger events in tests
    __trigger: (event: string, ...args: any[]) => {
      handlers[event]?.forEach(handler => handler(...args))
    },
    
    // Static properties
    imports: {},
  }
}

// Mock Delta class
export const createMockDelta = () => {
  return vi.fn().mockImplementation((ops?: any[]) => ({
    ops: ops || [],
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    retain: vi.fn().mockReturnThis(),
    push: vi.fn().mockReturnThis(),
    concat: vi.fn().mockReturnThis(),
    diff: vi.fn(() => ({ ops: [] })),
    compose: vi.fn().mockReturnThis(),
    transform: vi.fn().mockReturnThis(),
    length: vi.fn(() => 0),
    slice: vi.fn().mockReturnThis(),
    eachLine: vi.fn(),
  }))
}

// Setup mock in tests
export const setupQuillMock = () => {
  const mockQuillInstance = createMockQuill()
  const MockQuill = vi.fn(() => mockQuillInstance) as any

  // Static methods and properties
  MockQuill.register = vi.fn()
  MockQuill.import = vi.fn((path: string) => {
    if (path === 'delta') return createMockDelta()
    return null
  })
  MockQuill.find = vi.fn()
  MockQuill.imports = {}

  return { MockQuill, mockQuillInstance }
}
```

### Using the Mock in Tests

```typescript
// tests/components/QuillEditor.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { QuillEditor } from '@/components/QuillEditor'
import { setupQuillMock, createMockDelta } from '../mocks/quill'

// Mock Quill module
vi.mock('quill', () => {
  const { MockQuill } = setupQuillMock()
  return { default: MockQuill }
})

vi.mock('quill-delta', () => {
  return { default: createMockDelta() }
})

describe('QuillEditor', () => {
  let mockQuillInstance: ReturnType<typeof setupQuillMock>['mockQuillInstance']
  let MockQuill: ReturnType<typeof setupQuillMock>['MockQuill']

  beforeEach(() => {
    const mock = setupQuillMock()
    mockQuillInstance = mock.mockQuillInstance
    MockQuill = mock.MockQuill
    
    // Reset mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('creates Quill instance on mount', async () => {
      const wrapper = mount(QuillEditor, {
        props: {
          contentType: 'delta',
        },
      })

      await nextTick()
      await flushPromises()

      expect(MockQuill).toHaveBeenCalled()
      expect(wrapper.emitted('ready')).toBeTruthy()
    })

    it('passes options to Quill constructor', async () => {
      const options = {
        theme: 'snow',
        placeholder: 'Enter text...',
      }

      mount(QuillEditor, {
        props: {
          ...options,
          contentType: 'html',
        },
      })

      await nextTick()

      expect(MockQuill).toHaveBeenCalledWith(
        expect.any(Element),
        expect.objectContaining({
          theme: 'snow',
          placeholder: 'Enter text...',
        })
      )
    })
  })

  describe('Content Management', () => {
    it('sets initial content', async () => {
      const content = '<p>Hello World</p>'

      mount(QuillEditor, {
        props: {
          content,
          contentType: 'html',
        },
      })

      await nextTick()

      expect(mockQuillInstance.clipboard.dangerouslyPasteHTML).toHaveBeenCalled()
    })

    it('emits update:content on text change', async () => {
      const wrapper = mount(QuillEditor, {
        props: {
          contentType: 'html',
        },
      })

      await nextTick()

      // Simulate text-change event
      mockQuillInstance.__trigger('text-change', { ops: [] }, { ops: [] }, 'user')

      await nextTick()

      expect(wrapper.emitted('textChange')).toBeTruthy()
      expect(wrapper.emitted('update:content')).toBeTruthy()
    })
  })

  describe('Events', () => {
    it('emits focus and blur events', async () => {
      const wrapper = mount(QuillEditor, {
        props: {
          contentType: 'text',
        },
      })

      await nextTick()

      // Simulate selection change (focus)
      mockQuillInstance.__trigger(
        'selection-change',
        { index: 0, length: 0 },
        null,
        'user'
      )

      expect(wrapper.emitted('focus')).toBeTruthy()

      // Simulate selection change (blur)
      mockQuillInstance.__trigger(
        'selection-change',
        null,
        { index: 0, length: 0 },
        'user'
      )

      expect(wrapper.emitted('blur')).toBeTruthy()
    })
  })

  describe('Toolbar', () => {
    it('configures toolbar from prop', async () => {
      const toolbar = [['bold', 'italic'], ['link']]

      mount(QuillEditor, {
        props: {
          toolbar,
          contentType: 'delta',
        },
      })

      await nextTick()

      expect(MockQuill).toHaveBeenCalledWith(
        expect.any(Element),
        expect.objectContaining({
          modules: expect.objectContaining({
            toolbar,
          }),
        })
      )
    })
  })
})
```

### Alternative: Partial Mock with Real Quill

```typescript
import { vi } from 'vitest'

// For integration tests, you might want to use real Quill
// but mock specific methods
vi.mock('quill', async () => {
  const actual = await vi.importActual<typeof import('quill')>('quill')
  
  return {
    ...actual,
    default: class MockQuill extends actual.default {
      // Override specific methods
      getContents() {
        return { ops: [] }
      }
    },
  }
})
```

---

## Coverage Configuration

### Minimum Thresholds for Component Libraries

```typescript
// vitest.config.ts - Coverage section
coverage: {
  provider: 'v8',
  enabled: false,
  reporter: ['text', 'text-summary', 'json', 'html', 'lcov'],
  reportsDirectory: './coverage',
  
  include: [
    'packages/vue-quill/src/**/*.{ts,vue}',
  ],
  
  exclude: [
    '**/*.d.ts',
    '**/*.test.ts',
    '**/*.spec.ts',
    '**/types/**',
    '**/shims-vue.d.ts',
    '**/index.ts', // Re-export files
  ],
  
  // Recommended thresholds for component libraries
  thresholds: {
    // Minimum overall thresholds
    lines: 80,
    functions: 80,
    branches: 70, // Lower for complex conditionals
    statements: 80,
    
    // Per-file thresholds (optional)
    perFile: true,
    
    // Auto-update thresholds based on current coverage
    // autoUpdate: true,
  },
  
  // Fail if coverage decreases
  // watermarks: {
  //   lines: [80, 95],
  //   functions: [80, 95],
  //   branches: [70, 90],
  //   statements: [80, 95],
  // },
  
  // Collect coverage even when tests fail
  // all: true,
  
  // Skip files with no tests
  skipFull: false,
},
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:coverage:watch": "vitest --coverage",
    "test:ci": "vitest run --coverage --reporter=junit --outputFile=./coverage/junit.xml"
  }
}
```

### CI Configuration Example

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          
      - run: pnpm install
      
      - run: pnpm test:coverage
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

---

## Snapshot Testing

### Component Snapshot Testing

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import QuillEditor from '@/components/QuillEditor.vue'

describe('QuillEditor Snapshots', () => {
  it('renders default state correctly', () => {
    const wrapper = mount(QuillEditor, {
      props: {
        contentType: 'html',
        theme: 'snow',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders with toolbar correctly', () => {
    const wrapper = mount(QuillEditor, {
      props: {
        toolbar: [['bold', 'italic'], ['link']],
        contentType: 'delta',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders disabled state correctly', () => {
    const wrapper = mount(QuillEditor, {
      props: {
        enable: false,
        contentType: 'text',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
```

### Inline Snapshots

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from '@/components/Button.vue'

describe('Button', () => {
  it('renders primary variant', () => {
    const wrapper = mount(Button, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' },
    })

    // Inline snapshot - stored in test file
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<button class="btn btn-primary">Click me</button>"
    `)
  })
})
```

### Snapshot Serializers for Vue

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    snapshotSerializers: ['jest-serializer-vue'],
    
    snapshotFormat: {
      printBasicPrototype: false,
      escapeString: false,
    },
  },
})
```

### Custom Snapshot Serializer

```typescript
// tests/serializers/vue-wrapper.ts
import { expect } from 'vitest'

expect.addSnapshotSerializer({
  serialize(val: any, config, indentation, depth, refs, printer) {
    // Custom serialization for VueWrapper
    if (val && typeof val.html === 'function') {
      return val.html()
    }
    return printer(val, config, indentation, depth, refs)
  },
  test(val: any) {
    return val && typeof val.html === 'function'
  },
})
```

---

## Testing Composables

### Basic Composable Test

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset,
  }
}
```

```typescript
// tests/composables/useCounter.spec.ts
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { count, doubled } = useCounter()
    
    expect(count.value).toBe(0)
    expect(doubled.value).toBe(0)
  })

  it('initializes with custom value', () => {
    const { count, doubled } = useCounter(10)
    
    expect(count.value).toBe(10)
    expect(doubled.value).toBe(20)
  })

  it('increments count', () => {
    const { count, increment } = useCounter(0)
    
    increment()
    expect(count.value).toBe(1)
    
    increment()
    expect(count.value).toBe(2)
  })

  it('decrements count', () => {
    const { count, decrement } = useCounter(5)
    
    decrement()
    expect(count.value).toBe(4)
  })

  it('resets to initial value', () => {
    const { count, increment, reset } = useCounter(5)
    
    increment()
    increment()
    expect(count.value).toBe(7)
    
    reset()
    expect(count.value).toBe(5)
  })
})
```

### Composable with Lifecycle Hooks

```typescript
// composables/useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { width, height }
}
```

```typescript
// tests/composables/useWindowSize.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useWindowSize } from '@/composables/useWindowSize'

// Helper component for testing composables with lifecycle hooks
function withSetup<T>(composable: () => T) {
  let result: T

  const TestComponent = defineComponent({
    setup() {
      result = composable()
      return {}
    },
    template: '<div></div>',
  })

  const wrapper = mount(TestComponent)
  
  return {
    result: result!,
    wrapper,
  }
}

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth
  const originalInnerHeight = window.innerHeight

  beforeEach(() => {
    // Set initial window size
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth })
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight })
  })

  it('returns current window dimensions', async () => {
    const { result } = withSetup(() => useWindowSize())
    await nextTick()

    expect(result.width.value).toBe(1024)
    expect(result.height.value).toBe(768)
  })

  it('updates on window resize', async () => {
    const { result } = withSetup(() => useWindowSize())
    await nextTick()

    // Change window size
    Object.defineProperty(window, 'innerWidth', { value: 800 })
    Object.defineProperty(window, 'innerHeight', { value: 600 })

    // Trigger resize event
    window.dispatchEvent(new Event('resize'))
    await nextTick()

    expect(result.width.value).toBe(800)
    expect(result.height.value).toBe(600)
  })

  it('cleans up event listener on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { wrapper } = withSetup(() => useWindowSize())

    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
```

### Composable with External Dependencies

```typescript
// composables/useQuillEditor.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import Quill from 'quill'

export function useQuillEditor(elementRef: Ref<HTMLElement | null>) {
  const quill = ref<Quill | null>(null)
  const content = ref('')

  onMounted(() => {
    if (elementRef.value) {
      quill.value = new Quill(elementRef.value, {
        theme: 'snow',
      })
      
      quill.value.on('text-change', () => {
        content.value = quill.value?.getText() || ''
      })
    }
  })

  onUnmounted(() => {
    quill.value = null
  })

  return {
    quill,
    content,
  }
}
```

```typescript
// tests/composables/useQuillEditor.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, nextTick } from 'vue'
import { useQuillEditor } from '@/composables/useQuillEditor'
import { setupQuillMock } from '../mocks/quill'

vi.mock('quill', () => {
  const { MockQuill } = setupQuillMock()
  return { default: MockQuill }
})

describe('useQuillEditor', () => {
  it('initializes Quill on mount', async () => {
    const TestComponent = defineComponent({
      setup() {
        const editorRef = ref<HTMLElement | null>(null)
        const { quill, content } = useQuillEditor(editorRef)
        return { editorRef, quill, content }
      },
      template: '<div ref="editorRef"></div>',
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    expect(wrapper.vm.quill).not.toBeNull()
  })
})
```

---

## Test File Structure

```
packages/vue-quill/
├── src/
│   ├── components/
│   │   ├── QuillEditor.ts
│   │   └── options.ts
│   ├── composables/
│   │   └── useQuillEditor.ts
│   └── index.ts
│
tests/
├── setup.ts                    # Global test setup
├── global-setup.ts             # One-time global setup
├── mocks/
│   ├── quill.ts                # Quill mock factory
│   └── index.ts
├── fixtures/
│   ├── delta-content.ts        # Test data
│   └── html-content.ts
├── helpers/
│   ├── mount-helpers.ts        # Custom mount utilities
│   └── test-utils.ts           # Common test utilities
├── unit/
│   ├── components/
│   │   ├── QuillEditor.spec.ts
│   │   └── __snapshots__/
│   │       └── QuillEditor.spec.ts.snap
│   └── composables/
│       └── useQuillEditor.spec.ts
└── integration/
    └── QuillEditor.integration.spec.ts

vitest.config.ts
```

### Mount Helper Example

```typescript
// tests/helpers/mount-helpers.ts
import { mount, MountingOptions, VueWrapper } from '@vue/test-utils'
import { Component } from 'vue'

export function mountQuillEditor(
  options: Partial<MountingOptions<any>> = {}
): VueWrapper {
  const defaultOptions: MountingOptions<any> = {
    props: {
      contentType: 'html',
      theme: 'snow',
    },
    global: {
      stubs: {},
    },
  }

  return mount(QuillEditor, {
    ...defaultOptions,
    ...options,
    props: {
      ...defaultOptions.props,
      ...options.props,
    },
    global: {
      ...defaultOptions.global,
      ...options.global,
    },
  })
}

// Async wrapper for mounting with Quill initialization
export async function mountQuillEditorAsync(
  options: Partial<MountingOptions<any>> = {}
): Promise<VueWrapper> {
  const wrapper = mountQuillEditor(options)
  await flushPromises()
  await nextTick()
  return wrapper
}
```

---

## Best Practices

### 1. Test Organization

```typescript
describe('QuillEditor', () => {
  // Group related tests
  describe('Initialization', () => {
    it('mounts without errors', () => {})
    it('creates Quill instance', () => {})
    it('applies default options', () => {})
  })

  describe('Props', () => {
    it('handles content prop', () => {})
    it('handles theme prop', () => {})
    it('handles toolbar prop', () => {})
  })

  describe('Events', () => {
    it('emits textChange on edit', () => {})
    it('emits selectionChange on selection', () => {})
    it('emits ready after initialization', () => {})
  })

  describe('Methods', () => {
    it('exposes getQuill method', () => {})
    it('exposes getContents method', () => {})
  })

  describe('Edge Cases', () => {
    it('handles null content', () => {})
    it('handles empty toolbar', () => {})
  })
})
```

### 2. Avoid Test Implementation Details

```typescript
// ❌ Bad - Testing implementation details
it('calls internal method', () => {
  const wrapper = mount(Component)
  expect(wrapper.vm.internalMethod).toHaveBeenCalled()
})

// ✅ Good - Testing behavior
it('updates display when button clicked', async () => {
  const wrapper = mount(Component)
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('Updated')
})
```

### 3. Use Data-Test Attributes

```vue
<template>
  <div>
    <button data-test="submit-btn" @click="submit">Submit</button>
    <span data-test="error-message" v-if="error">{{ error }}</span>
  </div>
</template>
```

```typescript
it('shows error on failed submit', async () => {
  const wrapper = mount(Form)
  await wrapper.find('[data-test="submit-btn"]').trigger('click')
  expect(wrapper.find('[data-test="error-message"]').text()).toBe('Error')
})
```

### 4. Async Testing Best Practices

```typescript
import { flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'

it('handles async operations', async () => {
  const wrapper = mount(AsyncComponent)
  
  // Wait for Vue to update DOM
  await nextTick()
  
  // Wait for all promises to resolve
  await flushPromises()
  
  // Or wait for specific condition
  await vi.waitFor(() => {
    expect(wrapper.text()).toContain('Loaded')
  })
})
```

### 5. Test Isolation

```typescript
describe('QuillEditor', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Fresh instance for each test
    wrapper = mount(QuillEditor, { props: { contentType: 'html' } })
  })

  afterEach(() => {
    // Clean up
    wrapper.unmount()
    vi.clearAllMocks()
  })

  // Tests here get isolated wrapper
})
```

---

## Summary

This research covers all essential aspects of setting up Vitest for a Vue 3 component library:

| Topic | Key Points |
|-------|------------|
| **Configuration** | Use `jsdom` environment, setup files, coverage thresholds |
| **Vue Test Utils** | Global config, mount/shallowMount, wrapper methods |
| **Props/Emits** | Test via `wrapper.props()` and `wrapper.emitted()` |
| **defineModel** | Test two-way binding with `onUpdate:modelValue` |
| **Mocking** | Create factory functions for complex mocks like Quill |
| **Coverage** | 80% lines/statements, 70% branches minimum |
| **Snapshots** | Use for visual regression, inline for small outputs |
| **Composables** | Mount in wrapper component for lifecycle hooks |

### Recommended Dependencies

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^24.0.0",
    "vitest": "^2.0.0"
  }
}
```
