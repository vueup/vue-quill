<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script lang="ts">
// require sources
import Quill from "quill";
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";

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
    content: String,
    value: String,
    disabled: {
      type: Boolean,
      default: false,
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
  setup: (props, ctx) => {
    let quill: Quill | null = null;

    const _options = ref<object>({});
    const _content = ref<string>("");
    const defaultOptions = ref<object>(defaultOpts);

    onMounted(() => {
      initialize();
    });

    onBeforeUnmount(() => {
      quill = null;
    });

    // Init Quill instance
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

        // Instance
        quill = new Quill(editor.value as Element, _options.value);

        quill.enable(false);

        // Set editor content
        if (props.value || props.content) {
          quill.pasteHTML(props.value || props.content || "");
        }

        // Disabled editor
        if (!props.disabled) {
          quill.enable(true);
        }

        // Mark model as touched if editor lost focus
        quill.on("selection-change", (range: any) => {
          if (!range) {
            ctx.emit("blur", quill);
          } else {
            ctx.emit("focus", quill);
          }
        });

        // Update model if text changes
        quill.on("text-change", (delta: any, oldDelta: any, source: any) => {
          let html = editor.value?.children[0].innerHTML;
          const newQuill = quill;
          const text = quill?.getText();
          if (html === "<p><br></p>") html = "";
          _content.value = html as string;
          ctx.emit("input", _content.value);
          ctx.emit("change", { html, text, newQuill });
        });

        // Emit ready event
        ctx.emit("ready", quill);
      }
    };

    // Watch content change
    watch(_content, (newVal, oldVal) => {
      if (quill) {
        if (newVal && newVal !== _content.value) {
          _content.value = newVal;
          quill.pasteHTML(newVal);
        } else if (!newVal) {
          quill.setText("");
        }
      }
    });

    // Watch content change
    watch(
      () => props.value,
      (newVal, oldVal) => {
        if (quill) {
          if (newVal && newVal !== _content.value) {
            _content.value = newVal;
            quill.pasteHTML(newVal);
          } else if (!newVal) {
            quill.setText("");
          }
        }
      }
    );

    // Watch disabled change
    watch(
      () => props.disabled,
      (newVal, oldVal) => {
        if (quill) {
          quill.enable(!newVal);
        }
      }
    );

    return { editor, quill };
  },
});
</script>
