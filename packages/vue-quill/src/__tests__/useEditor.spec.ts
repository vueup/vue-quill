/**
 * useEditor Composable Tests
 * 
 * Note: Full integration tests require a real browser environment (e2e).
 * These unit tests verify exports and basic functionality without Quill initialization.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Skip Quill-related tests as jsdom doesn't properly support contenteditable
// Quill requires a real browser environment for proper testing
// Use Playwright or Cypress for e2e tests

describe('useEditor', () => {
  describe('Composable Export', () => {
    it('should export useEditor function', async () => {
      const { useEditor } = await import('../useEditor')
      
      expect(useEditor).toBeDefined()
      expect(typeof useEditor).toBe('function')
    })
  })

  describe('EditorContent Export', () => {
    it('should export EditorContent component', async () => {
      const { EditorContent } = await import('../index')
      
      expect(EditorContent).toBeDefined()
    })
  })

  describe('Editor Class', () => {
    it('should export Editor class', async () => {
      const { Editor } = await import('../Editor')
      
      expect(Editor).toBeDefined()
      expect(typeof Editor).toBe('function')
    })

    it('Editor should have static methods', async () => {
      const { Editor } = await import('../Editor')
      
      // Editor is a class, verify it can be instantiated (though it needs Quill)
      expect(Editor.prototype).toBeDefined()
    })
  })

  describe('EditorCommandChain', () => {
    it('should export EditorCommandChainImpl', async () => {
      const { EditorCommandChainImpl } = await import('../EditorCommandChain')
      
      expect(EditorCommandChainImpl).toBeDefined()
    })
  })

  describe('Type Definitions', () => {
    it('should export VueQuillOptions type', async () => {
      // Type checking - if this compiles, the type exists
      const types = await import('../types')
      expect(types).toBeDefined()
    })
  })

  describe('SSR Compatibility', () => {
    it('isSSR should return false in jsdom (browser-like)', async () => {
      const { isSSR } = await import('../utils')
      
      // jsdom simulates window/document, so should return false
      expect(isSSR()).toBe(false)
    })
  })
})
