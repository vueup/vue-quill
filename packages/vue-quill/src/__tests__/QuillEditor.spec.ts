/**
 * QuillEditor Component Tests
 * 
 * Note: Full integration tests require a real browser environment (e2e).
 * These unit tests verify component structure and props without Quill initialization.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Skip Quill-related tests as jsdom doesn't properly support contenteditable
// Quill requires a real browser environment for proper testing
// Use Playwright or Cypress for e2e tests

describe('QuillEditor', () => {
  describe('Component Structure', () => {
    it('should export QuillEditor component', async () => {
      const { QuillEditor } = await import('../index')
      expect(QuillEditor).toBeDefined()
    })
  })

  describe('Types', () => {
    it('should export proper types', async () => {
      const types = await import('../types')
      
      // Verify type exports exist (compile-time check)
      expect(types).toBeDefined()
    })
  })

  describe('Toolbar Presets', () => {
    it('should export toolbar presets', async () => {
      const { toolbarPresets } = await import('../toolbar')
      
      expect(toolbarPresets).toBeDefined()
      expect(toolbarPresets.minimal).toBeDefined()
      expect(toolbarPresets.essential).toBeDefined()
      expect(toolbarPresets.full).toBeDefined()
    })

    it('minimal preset should have basic formats', async () => {
      const { toolbarPresets } = await import('../toolbar')
      
      expect(Array.isArray(toolbarPresets.minimal)).toBe(true)
      expect(toolbarPresets.minimal.length).toBeGreaterThan(0)
    })

    it('essential preset should include more options than minimal', async () => {
      const { toolbarPresets } = await import('../toolbar')
      
      const minimalFlat = toolbarPresets.minimal.flat()
      const essentialFlat = toolbarPresets.essential.flat()
      
      expect(essentialFlat.length).toBeGreaterThanOrEqual(minimalFlat.length)
    })

    it('full preset should include most options', async () => {
      const { toolbarPresets } = await import('../toolbar')
      
      const essentialFlat = toolbarPresets.essential.flat()
      const fullFlat = toolbarPresets.full.flat()
      
      expect(fullFlat.length).toBeGreaterThanOrEqual(essentialFlat.length)
    })
  })

  describe('Utils', () => {
    it('should export isSSR utility', async () => {
      const { isSSR } = await import('../utils')
      
      expect(isSSR).toBeDefined()
      expect(typeof isSSR).toBe('function')
    })

    it('should export isDelta utility', async () => {
      const { isDelta } = await import('../utils')
      
      expect(isDelta).toBeDefined()
      expect(typeof isDelta).toBe('function')
    })

    it('isDelta should correctly identify Delta objects', async () => {
      const { isDelta } = await import('../utils')
      
      expect(isDelta({ ops: [] })).toBe(true)
      expect(isDelta({ ops: [{ insert: 'Hello' }] })).toBe(true)
      expect(isDelta('string')).toBe(false)
      expect(isDelta(null)).toBe(false)
      expect(isDelta({})).toBe(false)
    })
  })

  describe('Public Exports', () => {
    it('should export all public APIs', async () => {
      const exports = await import('../index')
      
      expect(exports.QuillEditor).toBeDefined()
      expect(exports.EditorContent).toBeDefined()
      expect(exports.useEditor).toBeDefined()
      expect(exports.Editor).toBeDefined()
      expect(exports.toolbarPresets).toBeDefined()
    })
  })
})
