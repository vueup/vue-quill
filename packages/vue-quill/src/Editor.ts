/**
 * VueQuill Editor Class
 *
 * The central Editor class that wraps Quill with Vue reactivity and enhanced API.
 * Following TipTap's Editor class pattern.
 *
 * @packageDocumentation
 */

import Quill from 'quill'
import type { QuillOptions, Range, EmitterSource } from 'quill'
import { Delta } from 'quill/core'
import type { Blot, LeafBlot, BlockBlot, EmbedBlot } from 'parchment'
import type {
  Editor as IEditor,
  EditorCommandChain,
  EditorCanCommands,
  EditorEvents,
  VueQuillOptions,
  ContentType,
} from './types'
import { isDelta } from './utils'
import { EditorCommandChainImpl } from './EditorCommandChain'
import { toolbarPresets } from './toolbar-presets'
import { isSSR } from './utils'

/**
 * VueQuill Editor implementation
 */
export class Editor implements IEditor {
  private _quill: Quill | null = null
  private _element: HTMLElement | null = null
  private _isReady = false
  private _isFocused = false
  private _isEditable: boolean
  private _options: VueQuillOptions
  private _contentType: ContentType
  private _eventHandlers = new Map<keyof EditorEvents, Set<EditorEvents[keyof EditorEvents]>>()

  constructor(options: VueQuillOptions = {}) {
    this._options = options
    this._isEditable = options.editable ?? true
    this._contentType = options.contentType ?? 'delta'
  }

  // ─── Quill Access ────────────────────────────────────────────────────

  get quill(): Quill | null {
    return this._quill
  }

  get element(): HTMLElement | null {
    return this._element
  }

  // ─── Reactive State ──────────────────────────────────────────────────

  get isReady(): boolean {
    return this._isReady
  }

  get isFocused(): boolean {
    return this._isFocused
  }

  get isEditable(): boolean {
    return this._isEditable
  }

  get isEmpty(): boolean {
    if (!this._quill) return true
    const text = this._quill.getText()
    // Quill always has at least a newline
    return text.length <= 1 && text.trim() === ''
  }

  // ─── Initialization ──────────────────────────────────────────────────

  /**
   * Initialize the editor with a DOM element
   * Called internally by useEditor or component
   */
  init(element: HTMLElement): this {
    if (isSSR()) {
      console.warn('[VueQuill] Editor cannot be initialized during SSR')
      return this
    }

    if (this._quill) {
      console.warn('[VueQuill] Editor is already initialized')
      return this
    }

    this._element = element

    try {
      // Register custom modules before creating Quill
      this._registerModules()

      // Build Quill options
      const quillOptions = this._buildQuillOptions()

      // Create Quill instance
      this._quill = new Quill(element, quillOptions)

      // Set initial content
      if (this._options.content) {
        this.setContent(this._options.content, false)
      }

      // Set editable state
      if (!this._isEditable) {
        this._quill.disable()
      }

      // Setup event handlers
      this._setupEventHandlers()

      // Mark as ready
      this._isReady = true

      // Fire onCreate callback
      this._options.onCreate?.({ editor: this })
      this._emit('create', { editor: this })

      // Handle autofocus
      if (this._options.autofocus) {
        const position =
          this._options.autofocus === true ? 'end' : this._options.autofocus
        this.focus(position)
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      this._options.onError?.({ editor: this, error: err })
      this._emit('error', { editor: this, error: err })
      throw error
    }

    return this
  }

  // ─── Content Methods ─────────────────────────────────────────────────

  getJSON(): Delta {
    return this._quill?.getContents() ?? new Delta()
  }

  getHTML(): string {
    return this._quill?.getSemanticHTML() ?? ''
  }

  getText(index?: number, length?: number): string {
    if (!this._quill) return ''
    if (index !== undefined && length !== undefined) {
      return this._quill.getText(index, length)
    }
    return this._quill.getText()
  }

  setContent(content: string | Delta, emitUpdate = true): this {
    if (!this._quill) return this

    const delta = this._parseContent(content)
    const oldDelta = this._quill.getContents()

    this._quill.setContents(delta, 'api')

    if (emitUpdate) {
      const newDelta = new Delta().retain(0).delete(oldDelta.length()).concat(delta)
      this._options.onUpdate?.({ editor: this, delta: newDelta, oldDelta, source: 'api' })
      this._emit('update', { editor: this, delta: newDelta, oldDelta, source: 'api' })
    }

    return this
  }

  clearContent(emitUpdate = true): this {
    return this.setContent('', emitUpdate)
  }

  insertContent(content: string | Delta, index?: number): this {
    if (!this._quill) return this

    const insertIndex = index ?? this._quill.getLength()
    const delta = this._parseContent(content)

    this._quill.updateContents(new Delta().retain(insertIndex).concat(delta), 'api')

    return this
  }

  // ─── Selection Methods ───────────────────────────────────────────────

  getSelection(): Range | null {
    return this._quill?.getSelection() ?? null
  }

  setSelection(indexOrRange: number | Range | null, lengthOrSource?: number | EmitterSource, source?: EmitterSource): this {
    if (!this._quill) return this

    if (indexOrRange === null) {
      // Clear selection
      this._quill.setSelection(null as unknown as Range)
    } else if (typeof indexOrRange === 'number') {
      const length = typeof lengthOrSource === 'number' ? lengthOrSource : 0
      const src = (typeof lengthOrSource === 'string' ? lengthOrSource : source) ?? 'api'
      this._quill.setSelection(indexOrRange, length, src)
    } else {
      const src = (typeof lengthOrSource === 'string' ? lengthOrSource : source) ?? 'api'
      this._quill.setSelection(indexOrRange.index, indexOrRange.length, src)
    }

    return this
  }

  selectAll(): this {
    if (!this._quill) return this
    const length = this._quill.getLength()
    this._quill.setSelection(0, length - 1, 'api')
    return this
  }

  // ─── Focus Methods ───────────────────────────────────────────────────

  focus(position: 'start' | 'end' | 'all' | number = 'start'): this {
    if (!this._quill) return this

    this._quill.focus()

    if (position === 'start') {
      this._quill.setSelection(0, 0, 'api')
    } else if (position === 'end') {
      const length = this._quill.getLength()
      this._quill.setSelection(length - 1, 0, 'api')
    } else if (position === 'all') {
      this.selectAll()
    } else if (typeof position === 'number') {
      this._quill.setSelection(position, 0, 'api')
    }

    return this
  }

  blur(): this {
    this._quill?.blur()
    return this
  }

  // ─── State Methods ───────────────────────────────────────────────────

  setEditable(editable: boolean): this {
    this._isEditable = editable
    if (this._quill) {
      if (editable) {
        this._quill.enable()
      } else {
        this._quill.disable()
      }
    }
    return this
  }

  setOptions(options: Partial<VueQuillOptions>): this {
    Object.assign(this._options, options)

    if (options.editable !== undefined) {
      this.setEditable(options.editable)
    }

    if (options.contentType !== undefined) {
      this._contentType = options.contentType
    }

    return this
  }

  // ─── History Methods ─────────────────────────────────────────────────

  /**
   * Undo the last change
   * @returns The editor instance for chaining
   */
  undo(): this {
    const history = this._quill?.getModule('history') as any
    history?.undo()
    return this
  }

  /**
   * Redo the last undone change
   * @returns The editor instance for chaining
   */
  redo(): this {
    const history = this._quill?.getModule('history') as any
    history?.redo()
    return this
  }

  /**
   * Clear the entire history stack
   * @returns The editor instance for chaining
   */
  clearHistory(): this {
    const history = this._quill?.getModule('history') as any
    history?.clear()
    return this
  }

  // ─── Formatting Methods ──────────────────────────────────────────────

  /**
   * Apply format to current selection or cursor
   * @param name - Format name (e.g., 'bold', 'color', 'align')
   * @param value - Format value
   * @param source - Source of the change
   * @returns The editor instance for chaining
   */
  format(name: string, value: any, source?: EmitterSource): this {
    this._quill?.format(name, value, source ?? 'api')
    return this
  }

  /**
   * Format text in a specific range
   * @param index - Starting index
   * @param length - Length of text to format
   * @param formatOrFormats - Format name or object of formats
   * @param value - Format value (if format is a string)
   * @returns The editor instance for chaining
   */
  formatText(index: number, length: number, formatOrFormats: string | Record<string, any>, value?: any): this {
    if (typeof formatOrFormats === 'string') {
      this._quill?.formatText(index, length, formatOrFormats, value, 'api')
    } else {
      this._quill?.formatText(index, length, formatOrFormats, 'api')
    }
    return this
  }

  /**
   * Get formats at selection or specific range
   * @param index - Starting index (optional)
   * @param length - Length of range (optional)
   * @returns Object containing active formats
   */
  getFormat(index?: number, length?: number): Record<string, any> {
    return this._quill?.getFormat(index, length) ?? {}
  }

  /**
   * Remove all formatting in a range
   * @param index - Starting index
   * @param length - Length of text to remove formatting from
   * @returns The editor instance for chaining
   */
  removeFormat(index: number, length: number): this {
    this._quill?.removeFormat(index, length, 'api')
    return this
  }

  // ─── Embed Methods ───────────────────────────────────────────────────

  /**
   * Insert an embed (image, video, etc.) at the specified index
   * @param index - Position to insert the embed
   * @param type - Type of embed (e.g., 'image', 'video')
   * @param value - Embed value (e.g., URL)
   * @returns The editor instance for chaining
   */
  insertEmbed(index: number, type: string, value: any): this {
    this._quill?.insertEmbed(index, type, value, 'api')
    return this
  }

  /**
   * Insert an image at the specified index
   * @param index - Position to insert the image
   * @param url - Image URL
   * @returns The editor instance for chaining
   */
  insertImage(index: number, url: string): this {
    return this.insertEmbed(index, 'image', url)
  }

  /**
   * Insert a video at the specified index
   * @param index - Position to insert the video
   * @param url - Video URL
   * @returns The editor instance for chaining
   */
  insertVideo(index: number, url: string): this {
    return this.insertEmbed(index, 'video', url)
  }

  // ─── Selection & Scroll Methods ──────────────────────────────────────

  /**
   * Get pixel bounds of a text range
   * @param index - Starting index
   * @param length - Length of range (default: 0)
   * @returns Bounds object with top, left, height, width or null
   */
  getBounds(index: number, length: number = 0): { top: number; left: number; height: number; width: number } | null {
    return this._quill?.getBounds(index, length) ?? null
  }

  /**
   * Scroll the current selection into view
   * @returns The editor instance for chaining
   */
  scrollSelectionIntoView(): this {
    this._quill?.scrollSelectionIntoView()
    return this
  }

  /**
   * Check if the editor currently has focus
   * @returns true if editor has focus, false otherwise
   */
  hasFocus(): boolean {
    return this._quill?.hasFocus() ?? false
  }

  /**
   * Synchronously check editor for updates and fire events
   * @param source - Source of the update
   * @returns The editor instance for chaining
   */
  update(source?: EmitterSource): this {
    this._quill?.update(source ?? 'api')
    return this
  }

  // ─── Content Manipulation ────────────────────────────────────────────

  /**
   * Insert text at a specific index
   * @param index - Position to insert text
   * @param text - Text to insert
   * @param formats - Optional formats to apply
   * @returns The editor instance for chaining
   */
  insertText(index: number, text: string, formats?: Record<string, any>): this {
    if (formats) {
      this._quill?.insertText(index, text, formats, 'api')
    } else {
      this._quill?.insertText(index, text, 'api')
    }
    return this
  }

  /**
   * Delete text in a specific range
   * @param index - Starting index
   * @param length - Length of text to delete
   * @returns The editor instance for chaining
   */
  deleteText(index: number, length: number): this {
    this._quill?.deleteText(index, length, 'api')
    return this
  }

  /**
   * Apply Delta changes to the editor
   * @param delta - Delta object with changes
   * @param source - Source of the change
   * @returns The editor instance for chaining
   */
  updateContents(delta: Delta, source?: EmitterSource): this {
    this._quill?.updateContents(delta, source ?? 'api')
    return this
  }

  // ─── Command Chain ───────────────────────────────────────────────────

  chain(): EditorCommandChain {
    return new EditorCommandChainImpl(this)
  }

  can(): EditorCanCommands {
    const quill = this._quill

    return {
      bold: () => quill !== null,
      italic: () => quill !== null,
      underline: () => quill !== null,
      strike: () => quill !== null,
      undo: () => {
        const history = quill?.getModule('history') as { stack?: { undo?: unknown[] } } | undefined
        return (history?.stack?.undo?.length ?? 0) > 0
      },
      redo: () => {
        const history = quill?.getModule('history') as { stack?: { redo?: unknown[] } } | undefined
        return (history?.stack?.redo?.length ?? 0) > 0
      },
    }
  }

  // ─── Extension Methods ───────────────────────────────────────────────

  /**
   * Get a Quill module instance by name
   * @param name - Module name (e.g., 'history', 'toolbar', 'clipboard')
   * @returns Module instance or null
   */
  getModule<T = any>(name: string): T | null {
    return (this._quill?.getModule(name) as T) ?? null
  }

  // ─── Event Methods ───────────────────────────────────────────────────

  on<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this {
    if (!this._eventHandlers.has(event)) {
      this._eventHandlers.set(event, new Set())
    }
    this._eventHandlers.get(event)!.add(handler as EditorEvents[keyof EditorEvents])
    return this
  }

  off<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this {
    this._eventHandlers.get(event)?.delete(handler as EditorEvents[keyof EditorEvents])
    return this
  }

  /**
   * Subscribe to an event once (automatically unsubscribes after first call)
   * @param event - Event name
   * @param handler - Event handler
   * @returns The editor instance for chaining
   */
  once<E extends keyof EditorEvents>(event: E, handler: EditorEvents[E]): this {
    const wrappedHandler = ((props: any) => {
      handler(props)
      this.off(event, wrappedHandler as EditorEvents[E])
    }) as EditorEvents[E]

    this.on(event, wrappedHandler)
    return this
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────

  destroy(): void {
    if (!this._quill) return

    const toolbar = this._quill.getModule('toolbar') as any
    const isCustomToolbar =
      typeof this._options.toolbar === 'string' &&
      this._options.toolbar.startsWith('#')

    if (toolbar && toolbar.container && !isCustomToolbar) {
      toolbar.container.remove()
    }

    this._options.onDestroy?.()
    this._emit('destroy')

    // Clear event handlers
    this._eventHandlers.clear()

    // Note: Quill doesn't have a destroy method
    // We just nullify references
    this._quill = null
    this._element = null
    this._isReady = false
    this._isFocused = false
  }

  // ─── Model Methods (Advanced) ────────────────────────────────────────

  find(domNode: Node, bubble?: boolean): Blot | Quill | null {
    return Quill.find(domNode, bubble) ?? null
  }

  getIndex(blot: Blot): number {
    return this._quill?.getIndex(blot) ?? -1
  }

  getLeaf(index: number): [LeafBlot | null, number] {
    return this._quill?.getLeaf(index) ?? [null, -1]
  }

  getLine(index: number): [BlockBlot | EmbedBlot | null, number] {
    return this._quill?.getLine(index) ?? [null, -1]
  }

  getLines(indexOrRange?: number | Range, length?: number): (BlockBlot | EmbedBlot)[] {
    if (!this._quill) return []
    if (typeof indexOrRange === 'number') {
      return this._quill.getLines(indexOrRange, length)
    } else if (indexOrRange) {
      return this._quill.getLines(indexOrRange)
    }
    return this._quill.getLines()
  }

  addContainer(classNameOrNode: string | HTMLElement, refNode?: Node): Element {
    if (!this._quill) {
      // Return a dummy element if quill is not ready, or throw?
      // For safety, let's return a disconnected div but warn
      console.warn('[VueQuill] addContainer called before editor init')
      return document.createElement('div')
    }
    if (typeof classNameOrNode === 'string') {
      return this._quill.addContainer(classNameOrNode, refNode)
    } else {
      return this._quill.addContainer(classNameOrNode, refNode)
    }
  }

  // ─── Private Methods ─────────────────────────────────────────────────

  private _emit<E extends keyof EditorEvents>(event: E, props?: Parameters<EditorEvents[E]>[0]): void {
    const handlers = this._eventHandlers.get(event)
    if (!handlers) {
      return
    }

    handlers.forEach((handler) => {
      try {
        // @ts-expect-error - TypeScript can't narrow the handler type properly
        handler(props)
      } catch (error) {
        console.error(`[VueQuill] Error in event handler for "${event}":`, error)
      }
    })
  }

  private _registerModules(): void {
    const modules = this._options.modules ?? []

    for (const mod of modules) {
      Quill.register(`modules/${mod.name}`, mod.module, true)
    }
  }

  private _buildQuillOptions(): QuillOptions {
    const { theme, toolbar, placeholder, quillOptions, modules } = this._options

    // Resolve toolbar configuration
    let toolbarConfig: unknown[][] | string | false | undefined
    if (toolbar === false) {
      toolbarConfig = false
    } else if (toolbar === 'minimal' || toolbar === 'essential' || toolbar === 'full') {
      toolbarConfig = [...toolbarPresets[toolbar]]
    } else if (typeof toolbar === 'string' && toolbar.startsWith('#')) {
      toolbarConfig = toolbar
    } else if (Array.isArray(toolbar)) {
      toolbarConfig = toolbar
    }

    // Build modules configuration
    const modulesConfig: Record<string, unknown> = {}

    if (toolbarConfig !== undefined) {
      modulesConfig['toolbar'] = toolbarConfig
    }

    // Add custom module options
    for (const mod of modules ?? []) {
      if (mod.options) {
        modulesConfig[mod.name] = mod.options
      } else {
        modulesConfig[mod.name] = true
      }
    }

    const options: QuillOptions = {
      theme: theme ?? 'snow',
      readOnly: !this._isEditable,
      modules: modulesConfig,
      ...quillOptions,
    }

    // Only add placeholder if defined
    if (placeholder !== undefined) {
      options.placeholder = placeholder
    }

    return options
  }

  private _setupEventHandlers(): void {
    if (!this._quill) return

    // Text change handler
    this._quill.on('text-change', (delta, oldDelta, source) => {
      this._options.onUpdate?.({ editor: this, delta, oldDelta, source })
      this._emit('update', { editor: this, delta, oldDelta, source })
      this._options.onTransaction?.({ editor: this })
      this._emit('transaction', { editor: this })
    })

    // Selection change handler
    this._quill.on('selection-change', (range, oldRange, source) => {
      // Track focus state
      const wasFocused = this._isFocused
      this._isFocused = range !== null

      // Fire selection update
      this._options.onSelectionUpdate?.({ editor: this, range, oldRange, source })
      this._emit('selectionUpdate', { editor: this, range, oldRange, source })

      // Fire focus/blur events
      if (!wasFocused && this._isFocused) {
        const event = new FocusEvent('focus')
        this._options.onFocus?.({ editor: this, event })
        this._emit('focus', { editor: this, event })
      } else if (wasFocused && !this._isFocused) {
        const event = new FocusEvent('blur')
        this._options.onBlur?.({ editor: this, event })
        this._emit('blur', { editor: this, event })
      }

      this._options.onTransaction?.({ editor: this })
      this._emit('transaction', { editor: this })
    })

    // Editor change handler (Quill v2)
    this._quill.on('editor-change', (eventName, ...args) => {
      this._emit('editorChange', { editor: this, name: eventName, args })
    })
  }

  private _parseContent(content: string | Delta): Delta {
    // Check if it's a Delta instance or a Delta-like object with ops array
    if (content instanceof Delta) {
      return content
    }

    // Handle plain objects with ops array (Delta-like objects)
    if (isDelta(content)) {
      return new Delta(content.ops)
    }

    // Check if it looks like HTML
    if (typeof content === 'string' && content.includes('<') && content.includes('>')) {
      // Use a temporary element to parse HTML into Delta
      // This is a simplified approach - in production, might use Quill's clipboard module
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const tempQuill = new Quill(tempDiv, { modules: {} })
      const delta = tempQuill.getContents()
      return delta
    }

    // Plain text - wrap in insert operation
    return new Delta().insert(content as string)
  }

  /**
   * Get content in the configured format
   */
  getContent(): string | Delta {
    switch (this._contentType) {
      case 'html':
        return this.getHTML()
      case 'text':
        return this.getText()
      case 'delta':
      default:
        return this.getJSON()
    }
  }
}
