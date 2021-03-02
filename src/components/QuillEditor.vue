<template>
  <div ref="wrapper" v-bind="$attrs">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
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
import { events, useHandlers } from "./events";
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
    // Quill events
    "text-change",
    "selection-change",
    "editor-change",
    // Additional events
    "update:content",
    "focus",
    "blur",
    "ready",
  ],
  setup: (props, ctx) => {
    let quill: Quill | null = null;
    const options = ref<QuillOptionsStatic>({});
    const wrapper = ref<HTMLDivElement>();
    const editor = ref<HTMLDivElement>();

    // Init Quill
    const initialize = () => {
      if (editor.value && wrapper.value) {
        // Options
        const themeOptions: QuillOptionsStatic = {
          theme: props.theme,
        };
        const clientOptions: QuillOptionsStatic =
          typeof props.options === "string"
            ? quillOptions[props.options]
            : props.options;

        options.value = Object.assign(
          {},
          props.globalOptions,
          clientOptions,
          themeOptions
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
      () => props.theme,
      () => {
        wrapper.value?.removeAttribute("style");
        editor.value?.removeAttribute("style");
        quill?.getModule("toolbar").container.remove();
        initialize();
      }
    );

    watch(
      () => props.options,
      () => {
        quill?.getModule("toolbar").container.remove();
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
      quill,
      options,
      wrapper,
      editor,
      toolbar,
      handleTextChange,
      handleSelectionChange,
      handleEditorChange,
    };
  },
});
</script>
