import {
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  QuillOptionsStatic,
  RangeStatic,
  Sources,
} from 'quill'
import Quill from 'quill'
import Delta from 'quill-delta'
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  nextTick,
  PropType,
  watch,
  ref,
  h,
} from 'vue'
import { toolbarOptions, ToolbarOptions } from './options'

export type Module = { name: string; module: unknown; options?: object }

type ContentPropType = string | Delta | undefined | null

export const QuillEditor = defineComponent({
  name: 'QuillEditor',
  inheritAttrs: false,
  props: {
    content: {
      type: [String, Object] as PropType<ContentPropType>,
    },
    contentType: {
      type: String as PropType<'delta' | 'html' | 'text'>,
      default: 'delta',
      validator: (value: string) => {
        return ['delta', 'html', 'text'].includes(value)
      },
    },
    enable: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    theme: {
      type: String as PropType<'snow' | 'bubble' | ''>,
      default: 'snow',
      validator: (value: string) => {
        return ['snow', 'bubble', ''].includes(value)
      },
    },
    toolbar: {
      type: [String, Array, Object],
      required: false,
      validator: (value: string | unknown) => {
        if (typeof value === 'string' && value !== '') {
          return value.charAt(0) === '#'
            ? true
            : Object.keys(toolbarOptions).indexOf(value) !== -1
        }
        return true
      },
    },
    modules: {
      type: Object as PropType<Module | Module[]>,
      required: false,
    },
    options: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
    globalOptions: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
  },
  emits: [
    'textChange',
    'selectionChange',
    'editorChange',
    'update:content',
    'focus',
    'blur',
    'ready',
  ],
  setup: (props, ctx) => {
    onMounted(() => {
      initialize()
    })

    onBeforeUnmount(() => {
      quill = null
    })

    let quill: Quill | null
    let options: QuillOptionsStatic
    const editor = ref<Element>()

    // Initialize Quill
    const initialize = () => {
      if (!editor.value) return
      options = composeOptions()
      // Register modules
      if (props.modules) {
        if (Array.isArray(props.modules)) {
          for (const module of props.modules) {
            Quill.register(`modules/${module.name}`, module.module)
          }
        } else {
          Quill.register(`modules/${props.modules.name}`, props.modules.module)
        }
      }
      // Create new Quill instance
      quill = new Quill(editor.value, options)
      // Set editor content
      setContents(props.content)
      // Set event handlers
      quill.on('text-change', handleTextChange)
      quill.on('selection-change', handleSelectionChange)
      quill.on('editor-change', handleEditorChange)
      // Remove editor class when theme changes
      if (props.theme !== 'bubble') editor.value.classList.remove('ql-bubble')
      if (props.theme !== 'snow') editor.value.classList.remove('ql-snow')
      // Fix clicking the quill toolbar is detected as blur event
      quill
        .getModule('toolbar')
        ?.container.addEventListener('mousedown', (e: MouseEvent) => {
          e.preventDefault()
        })
      // Emit ready event
      ctx.emit('ready', quill)
    }

    // Compose Options
    const composeOptions = (): QuillOptionsStatic => {
      const clientOptions: QuillOptionsStatic = {}
      if (props.theme !== '') clientOptions.theme = props.theme
      if (props.readOnly) clientOptions.readOnly = props.readOnly
      if (props.placeholder) clientOptions.placeholder = props.placeholder
      if (props.toolbar && props.toolbar !== '') {
        clientOptions.modules = {
          toolbar: (() => {
            if (typeof props.toolbar === 'object') {
              return props.toolbar
            } else if (typeof props.toolbar === 'string') {
              const str = props.toolbar as string
              return str.charAt(0) === '#'
                ? props.toolbar
                : toolbarOptions[props.toolbar as keyof ToolbarOptions]
            }
            return
          })(),
        }
      }
      if (props.modules) {
        const modules = (() => {
          const modulesOption: { [key: string]: unknown } = {}
          if (Array.isArray(props.modules)) {
            for (const module of props.modules) {
              modulesOption[module.name] = module.options ?? {}
            }
          } else {
            modulesOption[props.modules.name] = props.modules.options ?? {}
          }
          return modulesOption
        })()
        clientOptions.modules = Object.assign(
          {},
          clientOptions.modules,
          modules
        )
      }
      return Object.assign(
        {},
        props.globalOptions,
        props.options,
        clientOptions
      )
    }

    const maybeClone = (delta: ContentPropType) => {
      return typeof delta === 'object' && delta ? delta.slice() : delta
    }

    const deltaHasValuesOtherThanRetain = (delta: Delta): boolean => {
      return Object.values(delta.ops).some(
        (v) => !v.retain || Object.keys(v).length !== 1
      )
    }

    // Doesn't need reactivity, but does need to be cloned to avoid deep mutations always registering as equal
    let internalModel: typeof props.content
    const internalModelEquals = (against: ContentPropType) => {
      if (typeof internalModel === typeof against) {
        if (against === internalModel) {
          return true
        }
        // Ref/Proxy does not support instanceof, so do a loose check
        if (
          typeof against === 'object' &&
          against &&
          typeof internalModel === 'object' &&
          internalModel
        ) {
          return !deltaHasValuesOtherThanRetain(
            internalModel.diff(against as Delta)
          )
        }
      }
      return false
    }

    const handleTextChange: TextChangeHandler = (
      delta: Delta,
      oldContents: Delta,
      source: Sources
    ) => {
      internalModel = maybeClone(getContents() as string | Delta)
      // Update v-model:content when text changes
      if (!internalModelEquals(props.content)) {
        ctx.emit('update:content', internalModel)
      }
      ctx.emit('textChange', { delta, oldContents, source })
    }

    const isEditorFocus = ref<boolean>()
    const handleSelectionChange: SelectionChangeHandler = (
      range: RangeStatic,
      oldRange: RangeStatic,
      source: Sources
    ) => {
      // Set isEditorFocus if quill.hasFocus()
      isEditorFocus.value = !!quill?.hasFocus()
      ctx.emit('selectionChange', { range, oldRange, source })
    }

    watch(isEditorFocus, (focus) => {
      if (focus) ctx.emit('focus', editor)
      else ctx.emit('blur', editor)
    })

    const handleEditorChange: EditorChangeHandler = (
      ...args:
        | [
            name: 'text-change',
            delta: Delta,
            oldContents: Delta,
            source: Sources
          ]
        | [
            name: 'selection-change',
            range: RangeStatic,
            oldRange: RangeStatic,
            source: Sources
          ]
    ) => {
      if (args[0] === 'text-change')
        ctx.emit('editorChange', {
          name: args[0],
          delta: args[1],
          oldContents: args[2],
          source: args[3],
        })
      if (args[0] === 'selection-change')
        ctx.emit('editorChange', {
          name: args[0],
          range: args[1],
          oldRange: args[2],
          source: args[3],
        })
    }

    const getEditor = (): Element => {
      return editor.value as Element
    }

    const getToolbar = (): Element => {
      return quill?.getModule('toolbar')?.container
    }

    const getQuill = (): Quill => {
      if (quill) return quill
      else
        throw `The quill editor hasn't been instantiated yet,
                  make sure to call this method when the editor ready
                  or use v-on:ready="onReady(quill)" event instead.`
    }

    const getContents = (index?: number, length?: number) => {
      if (props.contentType === 'html') {
        return getHTML()
      } else if (props.contentType === 'text') {
        return getText(index, length)
      }
      return quill?.getContents(index, length)
    }

    const setContents = (content: ContentPropType, source: Sources = 'api') => {
      const normalizedContent = !content
        ? props.contentType === 'delta'
          ? new Delta()
          : ''
        : content
      if (props.contentType === 'html') {
        setHTML(normalizedContent as string)
      } else if (props.contentType === 'text') {
        setText(normalizedContent as string, source)
      } else {
        quill?.setContents(normalizedContent as Delta, source)
      }
      internalModel = maybeClone(normalizedContent)
    }

    const getText = (index?: number, length?: number): string => {
      return quill?.getText(index, length) ?? ''
    }

    const setText = (text: string, source: Sources = 'api') => {
      quill?.setText(text, source)
    }

    const getHTML = (): string => {
      return quill?.root.innerHTML ?? ''
    }

    const setHTML = (html: string) => {
      if (quill) quill.root.innerHTML = html
    }

    const pasteHTML = (html: string, source: Sources = 'api') => {
      const delta = quill?.clipboard.convert(html as {})
      if (delta) quill?.setContents(delta, source)
    }

    const focus = () => {
      quill?.focus()
    }

    const reinit = () => {
      nextTick(() => {
        if (!ctx.slots.toolbar && quill)
          quill.getModule('toolbar')?.container.remove()
        initialize()
      })
    }

    watch(
      () => props.content,
      (newContent) => {
        if (!quill || !newContent || internalModelEquals(newContent)) return

        // Restore the selection and cursor position after updating the content
        const selection = quill.getSelection()
        if (selection) {
          nextTick(() => quill?.setSelection(selection))
        }
        setContents(newContent)
      },
      { deep: true }
    )

    watch(
      () => props.enable,
      (newValue) => {
        if (quill) quill.enable(newValue)
      }
    )

    return {
      editor,
      getEditor,
      getToolbar,
      getQuill,
      getContents,
      setContents,
      getHTML,
      setHTML,
      pasteHTML,
      focus,
      getText,
      setText,
      reinit,
    }
  },
  render() {
    return [
      this.$slots.toolbar?.(),
      h('div', { ref: 'editor', ...this.$attrs }),
    ]
  },
})
