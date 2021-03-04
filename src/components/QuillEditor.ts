import Quill, {
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  QuillOptionsStatic,
  RangeStatic,
} from "quill";
import { Delta } from "types-quill-delta";
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

// export
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
    options: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
    },
    theme: {
      type: String,
      required: false,
      validator: (value: string) => {
        return ["", "snow", "bubble"].includes(value)
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
    globalOptions: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
      default: {},
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
        if (typeof props.content === "string")
          quill.setText(props.content);
        else
          quill.setContents(props.content as Delta);
        // Set event handlers
        quill.on("text-change", handleTextChange);
        quill.on("selection-change", handleSelectionChange);
        quill.on("editor-change", handleEditorChange);
        // Remove editor class when theme changes
        if (props.theme !== "bubble") editor.value.classList.remove("ql-bubble");
        if (props.theme !== "snow") editor.value.classList.remove("ql-snow");
        // Emit ready event
        ctx.emit("ready", quill);
      }
    };

    // Compose Options
    const composeOptions = (): QuillOptionsStatic => {
      const clientOptions: QuillOptionsStatic = {
        theme: props.theme === "" ? undefined : props.theme,
        readOnly: props.readOnly,
        placeholder: props.placeholder,
        modules: {
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
      };
      return Object.assign(
        {},
        props.globalOptions,
        props.options,
        clientOptions,
      );
    }

    const handleTextChange: TextChangeHandler = (...args) => {
      // Update v-model:content when text changes
      ctx.emit("update:content", quill?.getContents());
      ctx.emit("textChange", ...args);
    };

    const isEditorFocus = ref<boolean>()
    const handleSelectionChange: SelectionChangeHandler = (...args) => {
      // Mark model as touched if editor lost focus
      isEditorFocus.value = quill?.hasFocus() ? true : false
      ctx.emit("selectionChange", ...args);
    };

    watch(isEditorFocus, (focus) => {
      if (focus) ctx.emit("focus", editor)
      else ctx.emit("blur", editor);
    })

    const handleEditorChange: EditorChangeHandler = (name: String, ...args) => {
      ctx.emit("editorChange", name, ...args);
    };

    const getQuill = (): Quill => {
      if (quill) return quill
      else throw `The quill editor hasn't been instantiated yet, 
                  make sure to call this method when the editor ready
                  or use v-on:ready="onReady(quill)" event instead.`
    }

    const getHTML = (): String => {
      return quill?.root.innerHTML ?? ""
    }

    const setHTML = (html: string) => {
      if (quill) quill.root.innerHTML = html
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

    watch(() => props.theme, (newTheme, oldTheme) => {
      if (ctx.slots.toolbar && quill) {
        if (oldTheme === "snow")
          quill?.getModule("toolbar").container.classList.remove("ql-snow")
        if (oldTheme === "bubble") {
          quill?.getModule("toolbar").container.classList.remove("ql-bubble")
          const qlContainer = quill?.getModule("toolbar").container.closest(".ql-container")
          qlContainer.insertAdjacentElement('beforebegin', quill?.getModule("toolbar").container)
        }
      }
    })

    watch(
      [
        () => props.options,
        () => props.theme,
        () => props.toolbar
      ],
      () => {
        if (!ctx.slots.toolbar && quill) 
          quill.getModule("toolbar")?.container.remove();
        initialize();
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
      getQuill,
      getHTML,
      setHTML,
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
