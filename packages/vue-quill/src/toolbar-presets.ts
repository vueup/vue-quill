/**
 * VueQuill Toolbar Presets
 *
 * Pre-configured toolbar configurations for common use cases.
 * Based on Quill's toolbar module options.
 *
 * @packageDocumentation
 */

import type { ToolbarPresets } from './types'

/**
 * Minimal toolbar preset
 * Basic text formatting only
 */
const minimal: readonly unknown[][] = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['clean'],
]

/**
 * Essential toolbar preset
 * Common formatting options for most use cases
 */
const essential: readonly unknown[][] = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['link', 'image'],
  ['clean'],
]

/**
 * Full toolbar preset
 * All available formatting options
 */
const full: readonly unknown[][] = [
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ align: [] }],
  ['link', 'image', 'video', 'formula'],
  ['clean'],
]

/**
 * Built-in toolbar presets
 */
export const toolbarPresets: ToolbarPresets = {
  minimal,
  essential,
  full,
} as const

/**
 * Resolve toolbar configuration from preset name or custom config
 */
export function resolveToolbar(
  toolbar: 'minimal' | 'essential' | 'full' | `#${string}` | unknown[][] | false | undefined
): unknown[][] | string | false | undefined {
  if (toolbar === undefined) {
    return undefined
  }

  if (toolbar === false) {
    return false
  }

  if (toolbar === 'minimal' || toolbar === 'essential' || toolbar === 'full') {
    // Return a copy to prevent mutation
    return [...toolbarPresets[toolbar]]
  }

  if (typeof toolbar === 'string' && toolbar.startsWith('#')) {
    // CSS selector for external toolbar
    return toolbar
  }

  if (Array.isArray(toolbar)) {
    return toolbar
  }

  return undefined
}
