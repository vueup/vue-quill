/**
 * VueQuill Utilities
 *
 * Helper functions for SSR detection, content conversion,
 * and other common operations.
 *
 * @packageDocumentation
 */

import type { Delta } from 'quill'

/**
 * Check if we're running in a server-side rendering environment
 */
export function isSSR(): boolean {
  return typeof window === 'undefined' || typeof document === 'undefined'
}

/**
 * Check if a value is a Delta object
 */
export function isDelta(value: unknown): value is Delta {
  return (
    value !== null &&
    typeof value === 'object' &&
    'ops' in value &&
    Array.isArray((value as Delta).ops)
  )
}

/**
 * Check if content appears to be HTML
 */
export function isHTML(content: string): boolean {
  return content.includes('<') && content.includes('>')
}

/**
 * Normalize content to always be a string or null
 */
export function normalizeContent(
  content: string | Delta | null | undefined
): string | Delta | null {
  if (content === undefined || content === '') {
    return null
  }
  return content
}

/**
 * Create a unique ID for editor instances
 */
export function createEditorId(prefix = 'quill-editor'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Debounce function for rate-limiting callbacks
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function debounced(this: unknown, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Check if two Delta objects are equal
 */
export function deltasEqual(a: Delta | null, b: Delta | null): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  if (!isDelta(a) || !isDelta(b)) return false
  if (a.ops.length !== b.ops.length) return false

  return JSON.stringify(a.ops) === JSON.stringify(b.ops)
}

/**
 * Safely get the length of content
 */
export function getContentLength(content: string | Delta | null): number {
  if (content === null) return 0

  if (isDelta(content)) {
    return content.ops.reduce((length, op) => {
      if (typeof op.insert === 'string') {
        return length + op.insert.length
      }
      // Embeds count as 1
      return length + 1
    }, 0)
  }

  return content.length
}

/**
 * Check if content is empty
 */
export function isContentEmpty(content: string | Delta | null): boolean {
  if (content === null) return true

  if (isDelta(content)) {
    // Empty delta has single newline insert
    if (content.ops.length === 0) return true
    if (content.ops.length === 1) {
      const op = content.ops[0]
      if (typeof op?.insert === 'string') {
        return op.insert === '\n' || op.insert.trim() === ''
      }
    }
    return false
  }

  return content.trim() === ''
}

/**
 * Create an empty Delta
 */
export async function createEmptyDelta(): Promise<Delta> {
  const { Delta } = await import('quill/core')
  return new Delta()
}
