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
      type: Object as PropType<Delta>,
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
      type: String as PropType<"snow" | "bubble">,
      default: "snow",
    },
    toolbar: {
      type: [String, Array, Object],
      required: false,
      default: toolbarOptions.default,
      validator: (value: string | object) => {
        if (typeof value === "string") {
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
    "text-change",
    "selection-change",
    "editor-change",
    "update:content",
    "focus",
    "blur",
    "ready",
  ],
  setup: (props, ctx) => {
    let quill: Quill | null;
    let options: QuillOptionsStatic;
    const editor = ref<HTMLDivElement>();

    // Initialize Quill
    const initialize = () => {
      if (editor.value) {
        // Compose Options
        const customOptions: QuillOptionsStatic = {
          theme: props.theme,
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
        options = Object.assign(
          {},
          props.globalOptions,
          props.options,
          customOptions,
        );
        // Create new instance
        quill = new Quill(editor.value as Element, options);
        // Set editor content
        if (props.content) quill.setContents(props.content);
        // Set event handlers
        quill.on("text-change", handleTextChange);
        quill.on("selection-change", handleSelectionChange);
        quill.on("editor-change", handleEditorChange);
        // Style the editor
        if (props.theme !== "bubble") editor.value.classList.remove("ql-bubble");
        if (props.theme !== "snow") editor.value.classList.remove("ql-snow");
        // Emit ready event
        ctx.emit("ready", quill);
      }
    };

    const handleTextChange: TextChangeHandler = (...args) => {
      // Update model if text changes
      ctx.emit("update:content", quill?.getContents());
      ctx.emit("text-change", ...args);
    };

    const handleSelectionChange: SelectionChangeHandler = (
      range: RangeStatic,
      ...args
    ) => {
      // Mark model as touched if editor lost focus
      if (!range) ctx.emit("blur", quill);
      else ctx.emit("focus", quill);
      ctx.emit("selection-change", range, ...args);
    };

    const handleEditorChange: EditorChangeHandler = (name: String, ...args) => {
      ctx.emit("editor-change", name, ...args);
    };

    onMounted(() => {
      initialize();
    });

    onBeforeUnmount(() => {
      quill = null;
    });

    watch(
      () => props.content,
      (newContent, oldContent) => {
        if (quill) {
          if (newContent && newContent !== props.content) {
            quill.setContents(newContent);
          } else if (!newContent) {
            quill.setText("");
          }
        }
      }
    );

    watch(
      [
        () => props.options,
        () => props.theme,
        () => props.toolbar
      ],
      () => {
        if (!ctx.slots.toolbar) quill?.getModule("toolbar").container.remove();
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
    };
  },
  inheritAttrs: false,
  render() {
    return [
      this.$slots.toolbar?.(),
      h("div", { ref: "editor", ...this.$attrs })
    ]
  },
});
