import {
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  QuillOptionsStatic,
  RangeStatic,
  Sources,
} from "quill";
import Quill from "quill"
import Delta from "quill-delta";
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  watch,
  ref,
  h,
} from "vue";
import { toolbarOptions } from "./options";

export default defineComponent({
  name: "QuillEditor",
  props: {
    content: {
      type: [String, Object] as PropType<String | Delta>,
      default: {},
    },
    enable: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      required: false
    },
    theme: {
      type: String,
      default: "snow",
      validator: (value: string) => {
        return ["snow", "bubble", ""].includes(value)
      }
    },
    toolbar: {
      type: [String, Array, Object],
      required: false,
      validator: (value: string | object) => {
        if (typeof value === "string" && value !== "") {
          return value.charAt(0) === "#"
            ? true
            : Object.keys(toolbarOptions).indexOf(value) !== -1;
        }
        return true;
      },
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
    "textChange",
    "selectionChange",
    "editorChange",
    "update:content",
    "focus",
    "blur",
    "ready",
  ],
  setup: (props, ctx) => {
    onMounted(() => {
      initialize();
    });

    onBeforeUnmount(() => {
      quill = null;
    });

    let quill: Quill | null;
    let options: QuillOptionsStatic;
    const editor = ref<Element>();

    // Initialize Quill
    const initialize = () => {
      if (editor.value) {
        options = composeOptions()
        // Create new instance
        quill = new Quill(editor.value, options);
        // Set editor content
        if (typeof props.content === "string") {
          quill.setText(props.content);
          ctx.emit("update:content", quill.getContents());
        } else {
          quill.setContents(props.content as Delta);
        }
        // Set event handlers
        quill.on("text-change", handleTextChange);
        quill.on("selection-change", handleSelectionChange);
        quill.on("editor-change", handleEditorChange);
        // Remove editor class when theme changes
        if (props.theme !== "bubble") editor.value.classList.remove("ql-bubble");
        if (props.theme !== "snow") editor.value.classList.remove("ql-snow");
        // Fix clicking the quill toolbar is detected as blur event
        quill.getModule("toolbar")?.container.addEventListener("mousedown", (e: MouseEvent) => {
          e.preventDefault();
        });
        // Emit ready event
        ctx.emit("ready", quill);
      }
    };

    // Compose Options
    const composeOptions = (): QuillOptionsStatic => {
      const clientOptions: QuillOptionsStatic = {}
      if (props.theme !== "")
        clientOptions.theme = props.theme
      if (props.readOnly)
        clientOptions.readOnly = props.readOnly
      if (props.placeholder)
        clientOptions.placeholder = props.placeholder
      if (props.toolbar && props.toolbar !== "") {
        clientOptions.modules = {
          toolbar: (() => {
            if (typeof props.toolbar === "object") {
              return props.toolbar
            } else if (typeof props.toolbar === "string") {
              const str = props.toolbar as string
              return str.charAt(0) === "#"
                ? props.toolbar
                : toolbarOptions[props.toolbar]
            }
          })()
        }
      }
      return Object.assign(
        {},
        props.globalOptions,
        props.options,
        clientOptions,
      );
    }

    const handleTextChange: TextChangeHandler = (delta: Delta, oldContents: Delta, source: Sources) => {
      // Update v-model:content when text changes
      ctx.emit("update:content", quill?.getContents());
      ctx.emit("textChange", { delta, oldContents, source });
    };

    const isEditorFocus = ref<boolean>()
    const handleSelectionChange: SelectionChangeHandler = (range: RangeStatic, oldRange: RangeStatic, source: Sources) => {
      // Set isEditorFocus if quill.hasFocus()
      isEditorFocus.value = quill?.hasFocus() ? true : false
      ctx.emit("selectionChange", { range, oldRange, source });
    };

    watch(isEditorFocus, (focus) => {
      if (focus) ctx.emit("focus", editor)
      else ctx.emit("blur", editor);
    })

    const handleEditorChange: EditorChangeHandler = (name: "text-change" | "selection-change", ...args) => {
      if (name === "text-change") {
        ctx.emit(
          "editorChange",
          {
            name,
            delta: args[0] as Delta,
            oldContents: args[1] as Delta,
            source: args[2] as Sources
          }
        );
      } else if (name === "selection-change") {
        ctx.emit(
          "editorChange",
          {
            name,
            range: args[0] as RangeStatic,
            oldRange: args[1] as RangeStatic,
            source: args[2] as Sources
          }
        );
      }
    };

    const getEditor = (): Element => {
      return editor.value as Element
    }

    const getToolbar = (): Element => {
      return quill?.getModule("toolbar")?.container
    }

    const getQuill = (): Quill => {
      if (quill) return quill
      else throw `The quill editor hasn't been instantiated yet, 
                  make sure to call this method when the editor ready
                  or use v-on:ready="onReady(quill)" event instead.`
    }

    const getHTML = (): string => {
      return quill?.root.innerHTML ?? ""
    }

    const setHTML = (html: string) => {
      quill?.clipboard.dangerouslyPasteHTML(html)
    }

    const reinit = () => {
      if (!ctx.slots.toolbar && quill)
        quill.getModule("toolbar")?.container.remove();
      initialize();
    }

    watch(
      () => props.content,
      (newContent, oldContent) => {
        if (quill) {
          if (newContent && newContent !== props.content) {
            if (typeof newContent === "string")
              quill.setText(props.content as string);
            else
              quill.setContents(newContent as Delta);
          } else if (!newContent) {
            quill.setText("");
          }
        }
      }
    );

    watch(
      () => props.enable,
      (newValue, oldValue) => {
        if (quill) quill.enable(newValue);
      }
    );

    return {
      editor,
      getEditor,
      getToolbar,
      getQuill,
      getHTML,
      setHTML,
      reinit,
    };
  },
  inheritAttrs: false,
  render() {
    return [
      this.$slots.toolbar?.(),
      h("div", { ref: "editor", ...this.$attrs }),
    ]
  },
});
