// Test setup file for Vitest
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock ResizeObserver (not available in jsdom)
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock MutationObserver (partial implementation in jsdom)
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}))

// Mock getSelection (not available in jsdom)
global.document.getSelection = vi.fn().mockReturnValue({
  getRangeAt: vi.fn(),
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
})

// Configure Vue Test Utils
config.global.stubs = {}
