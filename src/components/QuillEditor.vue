<template>
  <div ref="wrapper" class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script lang="ts">
// require sources
import Quill, {
  TextChangeHandler,
  SelectionChangeHandler,
  EditorChangeHandler,
  RangeStatic,
  QuillOptionsStatic,
} from "quill";
import { Delta } from "types-quill-delta";
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";
import { options as quillOptions } from "./options";

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
    theme: {
      type: String,
      default: "snow",
    },
    options: {
      type: [String, Object],
      required: false,
      default: {},
      validator: (value: string | object) => {
        if (typeof value === "string") {
          return Object.keys(quillOptions).indexOf(value) !== -1;
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
    onMounted(() => {
      initialize();
    });

    onBeforeUnmount(() => {
      quill = null;
    });

    // Init Quill instance
    let quill: Quill | null = null;
    const options = ref<QuillOptionsStatic>({});
    const wrapper = ref<HTMLDivElement>();
    const editor = ref<HTMLDivElement>();

    const initialize = () => {
      if (editor.value && wrapper.value) {
        // Options
        const themeOptions: QuillOptionsStatic = {
          theme: props.theme,
        };
        let clientOptions: QuillOptionsStatic;
        if (typeof props.options === "string") {
          clientOptions = quillOptions[props.options];
        } else {
          clientOptions = props.options;
        }
        options.value = Object.assign(
          {},
          themeOptions,
          clientOptions,
          props.globalOptions
        );
        // Create Instance
        quill = new Quill(editor.value as Element, options.value);
        // Set editor content
        if (props.content) quill.setContents(props.content);
        // Set event handlers
        quill.on("text-change", handleTextChange);
        quill.on("selection-change", handleSelectionChange);
        quill.on("editor-change", handleEditorChange);
        // Style the editor
        if (props.theme !== "bubble") {
          wrapper.value.style.display = "flex";
          wrapper.value.style.flexDirection = "column";
          editor.value.style.flexGrow = "1";
          editor.value.style.overflowY = "auto";
        }
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
      if (!range) {
        ctx.emit("blur", quill);
      } else {
        ctx.emit("focus", quill);
      }
      ctx.emit("selection-change", range, ...args);
    };

    const handleEditorChange: EditorChangeHandler = (name: String, ...args) => {
      ctx.emit("editor-change", name, ...args);
    };

    // Watch content change
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

    // Watch enable change
    watch(
      () => props.enable,
      (newVal, oldVal) => {
        if (quill) {
          quill.enable(newVal);
        }
      }
    );

    // Watch theme and options change
    watch(
      () => props.theme,
      () => initialize()
    );
    watch(
      () => props.options,
      () => initialize()
    );

    return {
      quill,
      options,
      wrapper,
      editor,
      handleTextChange,
      handleSelectionChange,
      handleEditorChange,
    };
  },
});
</script>
