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
  shallowRef,
  h,
} from 'vue'
import { toolbarOptions, ToolbarOptions } from './options'

export type Module = { name: string; module: unknown; options?: object }

export const QuillEditor = defineComponent({
  name: 'QuillEditor',
  inheritAttrs: false,
  props: {
    content: {
      type: [String, Object] as PropType<string | Delta>,
      default: () => {},
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

    const internalModel = shallowRef(props.content)
    const internalModelEquals = (against: Delta | String | undefined) => {
      if (typeof internalModel.value === typeof against) {
        if (against === internalModel.value) {
          return true
        }
        if (against instanceof Delta && internalModel.value instanceof Delta) {
          return internalModel.value.diff(against).length() > 0
        }
      }
      return false
    }
    const handleTextChange: TextChangeHandler = (
      delta: Delta,
      oldContents: Delta,
      source: Sources
    ) => {
      const content = getContents()
      if (content) {
        // Quill should never be null at this point, so content should not be undefined but let's make ts happy
        internalModel.value = content
        // Update v-model:content when text changes
        if (!internalModelEquals(props.content)) {
          ctx.emit('update:content', internalModel.value)
        }
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

    const setContents = (content: string | Delta, source: Sources = 'api') => {
      if (props.contentType === 'html') {
        setHTML(content as string)
      } else if (props.contentType === 'text') {
        setText(content as string, source)
      } else {
        quill?.setContents(content as Delta, source)
      }
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

        internalModel.value = newContent
        // Restore the selection and cursor position after updating the content
        const selection = quill.getSelection()
        if (selection) {
          nextTick(() => quill?.setSelection(selection))
        }
        setContents(newContent)
      }
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
