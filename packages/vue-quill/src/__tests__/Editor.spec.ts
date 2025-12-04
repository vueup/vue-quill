import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Editor } from '../Editor'
import Quill from 'quill'

// Mock Quill
vi.mock('quill', () => {
    const QuillMock = vi.fn()
    QuillMock.prototype = {
        on: vi.fn(),
        off: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        getText: vi.fn(() => '\n'),
        getContents: vi.fn(() => ({ ops: [] })),
        setContents: vi.fn(),
        updateContents: vi.fn(),
        getSelection: vi.fn(),
        setSelection: vi.fn(),
        focus: vi.fn(),
        blur: vi.fn(),
        getModule: vi.fn(),
        // New methods
        getIndex: vi.fn(),
        getLeaf: vi.fn(),
        getLine: vi.fn(),
        getLines: vi.fn(),
        addContainer: vi.fn(),
    }
    // Static methods
    // @ts-expect-error - Mocking static method
    QuillMock.find = vi.fn()
    return { default: QuillMock }
})

describe('Editor Class Enhancements', () => {
    let editor: Editor
    let element: HTMLElement

    beforeEach(() => {
        vi.clearAllMocks()
        element = document.createElement('div')
        editor = new Editor()
        editor.init(element)
    })

    it('should delegate find to Quill static method', () => {
        const node = document.createElement('div')
        editor.find(node, true)
        expect(Quill.find).toHaveBeenCalledWith(node, true)
    })

    it('should delegate getIndex to Quill instance', () => {
        const blot = {} as any
        editor.getIndex(blot)
        expect(editor.quill?.getIndex).toHaveBeenCalledWith(blot)
    })

    it('should delegate getLeaf to Quill instance', () => {
        editor.getLeaf(5)
        expect(editor.quill?.getLeaf).toHaveBeenCalledWith(5)
    })

    it('should delegate getLine to Quill instance', () => {
        editor.getLine(10)
        expect(editor.quill?.getLine).toHaveBeenCalledWith(10)
    })

    it('should delegate getLines to Quill instance', () => {
        editor.getLines(0, 10)
        expect(editor.quill?.getLines).toHaveBeenCalledWith(0, 10)
    })

    it('should delegate addContainer to Quill instance', () => {
        editor.addContainer('ql-custom')
        expect(editor.quill?.addContainer).toHaveBeenCalledWith('ql-custom', undefined)
    })

    it('should emit editorChange event', () => {
        const handler = vi.fn()
        editor.on('editorChange', handler)

        // Simulate Quill emitting editor-change
        const quillOn = editor.quill?.on as any
        const editorChangeCallback = quillOn.mock.calls.find((call: any) => call[0] === 'editor-change')?.[1]

        expect(editorChangeCallback).toBeDefined()

        editorChangeCallback('text-change', 'delta', 'oldDelta', 'user')

        expect(handler).toHaveBeenCalledWith({
            editor,
            name: 'text-change',
            args: ['delta', 'oldDelta', 'user']
        })
    })
})
