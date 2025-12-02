# Quill 2.x Migration Research

## Overview

Quill 2.0 was released on April 17, 2024 (current version: 2.0.3 as of November 2024). This document outlines the breaking changes, new features, and integration patterns for upgrading vue-quill from Quill 1.x to 2.x.

---

## 1. Breaking Changes from Quill 1.x to 2.x

### 1.1 Configuration Options

| Option | Change |
|--------|--------|
| `strict` | **Removed** - Was used to hide breaking changes under config |
| `scrollingContainer` | **Removed** - Quill now auto-detects scrollable ancestors |
| `registry` | **New** - Allows multiple editors with different formats |
| `formats` | **New** - Whitelist of allowed formats in editor |

### 1.2 Parchment Changes

```typescript
// OLD (Quill 1.x)
import Parchment from 'parchment'
const ClassAttributor = Parchment.Attributor.Class
const StyleAttributor = Parchment.Attributor.Style

// NEW (Quill 2.x)
import { ClassAttributor, StyleAttributor, Attributor } from 'parchment'
// Or via Quill.import
const Parchment = Quill.import('parchment')
// Parchment.ClassAttributor instead of Parchment.Attributor.Class
```

**Blot naming changes:**
- `Parchment.Scroll` → `Parchment.ScrollBlot`
- `Parchment.Embed` → `Parchment.EmbedBlot`
- `Parchment.Text` → `Parchment.TextBlot`
- `Parchment.Block` → `Parchment.BlockBlot`
- `Parchment.Inline` → `Parchment.InlineBlot`

**Blot constructor changes:**
```typescript
// OLD
class MyBlot extends Inline {
  constructor(node) {
    super(node)
  }
}

// NEW - scroll is now required
class MyBlot extends Inline {
  constructor(scroll, node) {
    super(scroll, node)
  }
  
  // Static formats method now receives scroll
  static formats(domNode, scroll) {
    // ...
  }
}
```

### 1.3 Clipboard Module Changes

```typescript
// OLD
clipboard.convert(html)

// NEW - API changed to include both HTML and text
clipboard.convert({ html: string, text: string })
// New method added
clipboard.onCapturePaste(...)
```

**Configuration changes:**
- `matchVisual` - **Removed** (only semantic interpretation used now)
- `pasteHTML` - **Removed** (was deprecated alias to `dangerouslyPasteHTML`)

### 1.4 Keyboard Module Changes

```typescript
// OLD - key bindings were case insensitive
keyboard.addBinding({ key: 'b', ... })

// NEW - key is now case sensitive and supports arrays
keyboard.addBinding({ key: 'B', ... })  // Different from 'b'
keyboard.addBinding({ key: ['a', 'b', 'c'], ... })  // Multiple keys

// Native keyboard event now passed to handlers
handler(range, context, event) {
  // event is the native KeyboardEvent
}
```

### 1.5 List Markup Changes

```html
<!-- OLD: Used both <ul> and <ol> -->
<ul><li>Bullet</li></ul>
<ol><li>Numbered</li></ol>

<!-- NEW: All lists use <ol> with CSS for styling -->
<ol><li data-list="bullet">Bullet</li></ol>
<ol><li data-list="ordered">Numbered</li></ol>
```

### 1.6 Code Block Markup

```html
<!-- OLD -->
<pre class="ql-syntax">code</pre>

<!-- NEW: Uses <div> for better syntax highlighting support -->
<div class="ql-code-block-container">
  <div class="ql-code-block">code</div>
</div>
```

### 1.7 Delta Format

**Removed support for deprecated delta formats:**
- Embeds with integer values
- Old list attribute keys

---

## 2. New TypeScript Types in Quill 2.x

### 2.1 Official Type Declarations

Quill 2.x is now written in TypeScript and provides **official type declarations**. No need for `@types/quill`:

```typescript
// Remove @types/quill from dependencies - no longer needed!
```

### 2.2 Core Type Imports

```typescript
// NEW imports directly from quill
import Quill from 'quill'
import { Delta } from 'quill'
// Or from quill/core for tree-shaking
import Quill from 'quill/core'
import { Delta } from 'quill/core'

// Delta is now exported from quill package (no need for quill-delta)
// quill-delta package is still available but quill re-exports it
```

### 2.3 Key Types Available

```typescript
import type {
  QuillOptions,
  Range,
  Bounds,
  Delta,
  Op,
  AttributeMap,
  EmitterSource,
} from 'quill'

// Event handler types
type TextChangeHandler = (delta: Delta, oldDelta: Delta, source: EmitterSource) => void
type SelectionChangeHandler = (range: Range | null, oldRange: Range | null, source: EmitterSource) => void
type EditorChangeHandler = (...args: TextChangeArgs | SelectionChangeArgs) => void

// Source types
type EmitterSource = 'api' | 'user' | 'silent'
```

### 2.4 Module Types

```typescript
// Toolbar module types
interface ToolbarOptions {
  container?: string | HTMLElement | (string | string[])[]
  handlers?: Record<string, (...args: any[]) => void>
}

// Keyboard binding types
interface KeyboardBinding {
  key: string | number | string[]
  shortKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  ctrlKey?: boolean
  prefix?: RegExp
  suffix?: RegExp
  format?: string[]
  collapsed?: boolean
  empty?: boolean
  offset?: number
  handler: (range: Range, context: KeyboardContext, event: KeyboardEvent) => boolean | void
}
```

---

## 3. Module Registration API in Quill 2.x

### 3.1 Basic Registration

```typescript
import Quill from 'quill'

// Register a single module
Quill.register('modules/custom', CustomModule)

// Register multiple items
Quill.register({
  'formats/custom-format': CustomFormat,
  'modules/custom-module-a': CustomModuleA,
  'modules/custom-module-b': CustomModuleB,
})

// Suppress warning for overwriting
Quill.register('modules/toolbar', CustomToolbar, true)

// Shorthand for formats (path auto-generated)
Quill.register(CustomFormat)  // Only works for formats!
```

### 3.2 Static Register Method (NEW in 2.x)

Blots can now have a static `register` method for dependent chains:

```typescript
class MyBlot extends Inline {
  static register() {
    // Register any dependent blots/attributors here
    // Called automatically when this blot is registered
  }
}
```

### 3.3 Custom Registry (NEW in 2.x)

```typescript
const Parchment = Quill.import('parchment')

// Create a custom registry
const registry = new Parchment.Registry()

// Register required blots
const Block = Quill.import('blots/block')
const Break = Quill.import('blots/break')
const Container = Quill.import('blots/container')
const Cursor = Quill.import('blots/cursor')
const Inline = Quill.import('blots/inline')
const Scroll = Quill.import('blots/scroll')
const Text = Quill.import('blots/text')

registry.register(Scroll, Block, Break, Container, Cursor, Inline, Text)

// Use registry in Quill instance
const quill = new Quill('#editor', {
  registry,
  theme: 'snow'
})
```

### 3.4 Importing Components

```typescript
// Via Quill.import()
const Delta = Quill.import('delta')
const Parchment = Quill.import('parchment')
const Toolbar = Quill.import('modules/toolbar')
const Link = Quill.import('formats/link')

// Or via ES6 imports (preferred for tree-shaking)
import { Delta } from 'quill'
import Link from 'quill/formats/link'
```

---

## 4. Delta Format Changes

### 4.1 Core Delta (No Changes)

The Delta format itself remains the same:

```typescript
import { Delta } from 'quill'

const delta = new Delta()
  .insert('Hello ')
  .insert('World', { bold: true })
  .insert('\n')
```

### 4.2 Deprecated Formats Removed

```typescript
// These old formats are NO LONGER supported:

// OLD: Embeds with integer values
{ insert: 1, attributes: { image: 'url' } }
// NEW: Always use proper embed format
{ insert: { image: 'url' } }

// OLD: List attributes with different keys
{ insert: '\n', attributes: { list: 'ordered' } }
// NEW: Same format, but internal representation changed
{ insert: '\n', attributes: { list: 'ordered' } }
```

### 4.3 quill-delta Package

The `quill-delta` package is still available and maintained. Quill 2.x re-exports it:

```typescript
// These are equivalent:
import { Delta } from 'quill'
import Delta from 'quill-delta'
```

---

## 5. Event Handling Differences

### 5.1 Event Names (Unchanged)

```typescript
// All three events still available
quill.on('text-change', (delta, oldDelta, source) => {})
quill.on('selection-change', (range, oldRange, source) => {})
quill.on('editor-change', (name, ...args) => {})
```

### 5.2 Source Types

```typescript
// Unchanged but now properly typed
type EmitterSource = 'api' | 'user' | 'silent'
```

### 5.3 Event Constants (NEW way to access)

```typescript
// Access event names via Quill
import Quill from 'quill'

quill.on(Quill.events.TEXT_CHANGE, handler)
quill.on(Quill.events.SELECTION_CHANGE, handler)
quill.on(Quill.events.EDITOR_CHANGE, handler)
```

### 5.4 History Module Events

Selection is now recorded in history (new in 2.x):

```typescript
// History now properly restores selection on undo/redo
quill.history.undo()  // Restores selection too
```

---

## 6. SSR Compatibility Considerations

### 6.1 Core Problem

Quill requires DOM APIs (`document`, `window`, `MutationObserver`):

```typescript
// This will fail on server:
import Quill from 'quill'  // Accesses window/document on import
```

### 6.2 Solution: Dynamic Import

```typescript
// Vue 3 with SSR
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  setup() {
    const quillInstance = ref<any>(null)
    
    onMounted(async () => {
      // Only import Quill on client side
      const { default: Quill } = await import('quill')
      quillInstance.value = new Quill('#editor', { theme: 'snow' })
    })
    
    return { quillInstance }
  }
})
```

### 6.3 Solution: Client-Only Component (Nuxt)

```vue
<!-- In Nuxt, use <ClientOnly> wrapper -->
<template>
  <ClientOnly>
    <QuillEditor />
  </ClientOnly>
</template>
```

### 6.4 Solution: Environment Check

```typescript
// Check for browser environment before importing
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  const Quill = (await import('quill')).default
  // Initialize Quill
}
```

### 6.5 Vue-Quill SSR Pattern

```typescript
import { defineComponent, onMounted, ref, shallowRef } from 'vue'

export const QuillEditor = defineComponent({
  setup() {
    const editor = ref<HTMLElement>()
    const quill = shallowRef<InstanceType<typeof import('quill').default> | null>(null)
    
    onMounted(async () => {
      // Dynamic import only on client
      const Quill = (await import('quill')).default
      
      if (editor.value) {
        quill.value = new Quill(editor.value, { theme: 'snow' })
      }
    })
    
    return { editor, quill }
  }
})
```

---

## 7. Modern ES Module Imports for Quill 2.x

### 7.1 Full Build

```typescript
// Import everything (includes all formats, modules, themes)
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
```

### 7.2 Core Build (Tree-Shakable)

```typescript
// Core build - no themes, minimal modules
import Quill from 'quill/core'
import 'quill/dist/quill.core.css'

// Then manually register what you need
import Bold from 'quill/formats/bold'
import Italic from 'quill/formats/italic'
import Header from 'quill/formats/header'

Quill.register({
  'formats/bold': Bold,
  'formats/italic': Italic,
  'formats/header': Header,
})
```

### 7.3 Individual Format Imports

```typescript
// Import specific formats
import Bold from 'quill/formats/bold'
import Italic from 'quill/formats/italic'
import Link from 'quill/formats/link'
import Image from 'quill/formats/image'
import Video from 'quill/formats/video'
import Header from 'quill/formats/header'
import List, { ListItem } from 'quill/formats/list'
import CodeBlock from 'quill/formats/code'
```

### 7.4 Module Imports

```typescript
// Import specific modules
import Toolbar from 'quill/modules/toolbar'
import Keyboard from 'quill/modules/keyboard'
import History from 'quill/modules/history'
import Clipboard from 'quill/modules/clipboard'
import Syntax from 'quill/modules/syntax'
```

### 7.5 Type Imports

```typescript
// Import types only
import type Quill from 'quill'
import type { Delta, Range, Bounds, QuillOptions, EmitterSource } from 'quill'
```

### 7.6 Delta Import

```typescript
// Delta can be imported from quill or quill-delta
import { Delta } from 'quill'
// OR
import Delta from 'quill-delta'

// For AttributeMap (new export in 2.0.3)
import { Delta, AttributeMap } from 'quill'
```

---

## 8. Impact on Vue-Quill Wrapper

### 8.1 Package.json Changes

```json
{
  "dependencies": {
    "quill": "^2.0.3"
    // Remove quill-delta - it's included in quill
  },
  "devDependencies": {
    // Remove @types/quill - types are built-in
  }
}
```

### 8.2 Type Import Updates

```typescript
// OLD (1.x)
import {
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  QuillOptionsStatic,
  RangeStatic,
  Sources,
} from 'quill'
import Delta from 'quill-delta'

// NEW (2.x)
import Quill from 'quill'
import type {
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  Range,  // Was RangeStatic
  EmitterSource,  // Was Sources
} from 'quill'
import { Delta } from 'quill'

// QuillOptionsStatic -> QuillOptions
import type { QuillOptions } from 'quill'
```

### 8.3 Clipboard.convert Usage

```typescript
// OLD
const delta = quill.clipboard.convert(html)

// NEW
const delta = quill.clipboard.convert({ html, text: '' })
```

### 8.4 getSemanticHTML (NEW)

```typescript
// New method for getting semantic HTML
const html = quill.getSemanticHTML()
// Or with range
const partialHtml = quill.getSemanticHTML(0, 10)
```

### 8.5 Focus Method Changes

```typescript
// NEW: focus() now accepts options
quill.focus()
quill.focus({ preventScroll: true })
```

---

## 9. Known Issues and Workarounds

### 9.1 Vite Source Map Warning

```
Failed to load source map quill/dist/quill.snow.css
```

**Workaround:** Add to vite.config.ts:
```typescript
export default defineConfig({
  css: {
    devSourcemap: false
  }
})
```

### 9.2 SVG Icons Inlined

SVG icons are now inlined in source code - no need to configure SVG loaders.

### 9.3 React/Vue Integration Timing

For frameworks, ensure Quill is initialized after DOM is ready:
```typescript
onMounted(() => {
  // Safe to initialize Quill here
})
```

### 9.4 Internet Explorer

IE support is **dropped** in Quill 2.x.

---

## 10. Migration Checklist for Vue-Quill

- [ ] Update `quill` dependency to `^2.0.3`
- [ ] Remove `quill-delta` dependency (re-exported from quill)
- [ ] Remove `@types/quill` if present
- [ ] Update type imports (`QuillOptionsStatic` → `QuillOptions`, `RangeStatic` → `Range`, `Sources` → `EmitterSource`)
- [ ] Update `clipboard.convert()` calls
- [ ] Add SSR guards (dynamic import or environment check)
- [ ] Update any Parchment blot extensions (scroll parameter, renamed exports)
- [ ] Test keyboard bindings (now case-sensitive)
- [ ] Remove `scrollingContainer` option if used
- [ ] Test list rendering (now all `<ol>`)
- [ ] Consider using `getSemanticHTML()` instead of `root.innerHTML`
- [ ] Update documentation for Quill 2.x compatibility

---

## References

- [Quill 2.0 Upgrading Guide](https://quilljs.com/docs/upgrading-to-2-0)
- [Quill 2.0 Release Notes](https://github.com/slab/quill/releases/tag/v2.0.0)
- [Quill API Documentation](https://quilljs.com/docs/api/)
- [Quill Registries](https://quilljs.com/docs/customization/registries)
- [Quill Installation](https://quilljs.com/docs/installation)
- [react-quill-new](https://github.com/vaguelyserious/react-quill) - React wrapper updated for Quill 2.x
