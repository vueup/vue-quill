<template>
  <div class="quill-editor">
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
} from "quill";
import { Delta } from "types-quill-delta";
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  watch,
} from "vue";

const defaultOpts: object = {
  theme: "snow",
  boundary: document.body,
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ["clean"],
      ["link", "image", "video"],
    ],
  },
  placeholder: "Insert text here ...",
  readOnly: false,
};

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
    options: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    globalOptions: {
      type: Object,
      required: false,
      default: () => ({}),
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
    const _options = ref<object>({});
    const defaultOptions = ref<object>(defaultOpts);

    onMounted(() => {
      initialize();
    });

    onBeforeUnmount(() => {
      quill = null;
    });

    // Init Quill instance
    let quill: Quill | null = null;
    const editor = ref<Element>();
    const initialize = () => {
      if (editor) {
        // Options
        _options.value = Object.assign(
          {},
          defaultOptions.value,
          props.globalOptions,
          props.options
        );
        // Create Instance
        quill = new Quill(editor.value as Element, _options.value);
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

    // Watch disabled change
    watch(
      () => props.enable,
      (newVal, oldVal) => {
        if (quill) {
          quill.enable(newVal);
        }
      }
    );

    return {
      editor,
      quill,
      onTextChangeHandler,
      onSelectionChangeHandler,
      onEditorChageHandler,
    };
  },
});
</script>