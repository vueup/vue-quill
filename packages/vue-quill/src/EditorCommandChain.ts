/**
 * VueQuill Editor Command Chain
 *
 * Provides a fluent API for chaining editor commands,
 * following TipTap's command chain pattern.
 *
 * @packageDocumentation
 */

import type { Delta } from 'quill'
import type { EditorCommandChain, Editor } from './types'

type CommandFn = () => void

/**
 * Implementation of chainable editor commands
 */
export class EditorCommandChainImpl implements EditorCommandChain {
  private _editor: Editor
  private _commands: CommandFn[] = []

  constructor(editor: Editor) {
    this._editor = editor
  }

  // ─── Formatting ──────────────────────────────────────────────────────

  bold(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('bold', !format['bold'])
    })
    return this
  }

  italic(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('italic', !format['italic'])
    })
    return this
  }

  underline(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('underline', !format['underline'])
    })
    return this
  }

  strike(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('strike', !format['strike'])
    })
    return this
  }

  // ─── Structure ───────────────────────────────────────────────────────

  setHeading(level: 1 | 2 | 3 | 4 | 5 | 6): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      quill.format('header', level)
    })
    return this
  }

  setParagraph(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      quill.format('header', false)
    })
    return this
  }

  setBlockquote(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('blockquote', !format['blockquote'])
    })
    return this
  }

  setCodeBlock(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('code-block', !format['code-block'])
    })
    return this
  }

  // ─── Lists ───────────────────────────────────────────────────────────

  setBulletList(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('list', format['list'] === 'bullet' ? false : 'bullet')
    })
    return this
  }

  setOrderedList(): EditorCommandChain {
    this._commands.push(() => {
      const quill = this._editor.quill
      if (!quill) return
      const format = quill.getFormat()
      quill.format('list', format['list'] === 'ordered' ? false : 'ordered')
    })
    return this
  }

  // ─── Selection & Focus ───────────────────────────────────────────────

  focus(position?: 'start' | 'end' | number): EditorCommandChain {
    this._commands.push(() => {
      this._editor.focus(position)
    })
    return this
  }

  blur(): EditorCommandChain {
    this._commands.push(() => {
      this._editor.blur()
    })
    return this
  }

  selectAll(): EditorCommandChain {
    this._commands.push(() => {
      this._editor.selectAll()
    })
    return this
  }

  // ─── Content ─────────────────────────────────────────────────────────

  setContent(content: string | Delta): EditorCommandChain {
    this._commands.push(() => {
      this._editor.setContent(content)
    })
    return this
  }

  insertContent(content: string | Delta): EditorCommandChain {
    this._commands.push(() => {
      this._editor.insertContent(content)
    })
    return this
  }

  clearContent(): EditorCommandChain {
    this._commands.push(() => {
      this._editor.clearContent()
    })
    return this
  }

  // ─── Execute ─────────────────────────────────────────────────────────

  run(): boolean {
    if (!this._editor.quill) {
      console.warn('[VueQuill] Cannot run commands: editor not initialized')
      return false
    }

    try {
      for (const command of this._commands) {
        command()
      }
      return true
    } catch (error) {
      console.error('[VueQuill] Error running command chain:', error)
      return false
    } finally {
      // Clear commands after running
      this._commands = []
    }
  }
}
