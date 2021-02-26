<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor" class="editor" :class="editorClass"></div>
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
import config from "./quill.config";

// export
export default defineComponent({
  name: "QuillEditor",
  // inheritAttrs: false,
  props: {
    content: {
      type: Object as PropType<Delta>,
      default: {},
    },
    enable: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
      default: {},
    },
    globalOptions: {
      type: Object as PropType<QuillOptionsStatic>,
      required: false,
      default: {},
    },
    baseOptions: {
      type: String,
      default: "default",
      validator: (value: string) => {
        return Object.keys(config.options).indexOf(value) !== -1;
      },
    },
  },
  emits: [
    "update:content",
    "blur",
    "focus",
    "ready",
    "text-change",
    "selection-change",
    "editor-change",
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
    const editor = ref<HTMLDivElement>();

    const initialize = () => {
      if (editor) {
        // Options
        options.value = Object.assign(
          options.value,
          props.globalOptions,
          config.options[props.baseOptions]
        );
        // Create Instance
        quill = new Quill(editor.value as Element, options.value);
        // Set editor content
        if (props.content) quill.setContents(props.content);
        // Set event handlers
        quill.on("text-change", onTextChangeHandler);
        quill.on("selection-change", onSelectionChangeHandler);
        quill.on("editor-change", onEditorChageHandler);
        // Emit ready event
        ctx.emit("ready", quill);
      }
    };

    const onTextChangeHandler: TextChangeHandler = (...args) => {
      // Update model if text changes
      ctx.emit("update:content", quill?.getContents());
      ctx.emit("text-change", ...args);
    };

    const onSelectionChangeHandler: SelectionChangeHandler = (
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

    const onEditorChageHandler: EditorChangeHandler = (
      name: String,
      ...args
    ) => {
      ctx.emit("editor-change", name, ...args);
    };

    let editorClass = computed(() => {
      if (props.baseOptions !== "bubble") {
        return "overflow-y-auto";
      }
    });

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

    return {
      quill,
      options,
      editor,
      editorClass,
      onTextChangeHandler,
      onSelectionChangeHandler,
      onEditorChageHandler,
    };
  },
});
</script>

<style scoped>
.quill-editor {
  display: flex;
  flex-direction: column;
  overflow: visible;
}
.quill-editor .editor {
  flex-grow: 1;
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>