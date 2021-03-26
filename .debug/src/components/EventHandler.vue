<template>
  <!-- Two-way Data-Binding -->
  <div>
    <QuillEditor
      ref="myEditor"
      theme="snow"
      toolbar="full"
      placeholder="Placeholder props..."
      :options="myLocalOptions"
      v-model:content="content"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @ready="onEditorReady"
      @textChange="onTextChange"
      @editorChange="onEditorChange"
      @selectionChange="onSelectionChange"
    />
  </div>
  <div class="h-"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Quill, QuillEditor } from "../../../src/main";

const myGlobalOptions = {
  placeholder: "Global Options....",
  modules: {
    toolbar: ["bold", "italic"],
  },
};

const myLocalOptions = ref({
  placeholder: "Local Options....",
  modules: {
    toolbar: ["bold", "italic", "underline"],
  },
});

QuillEditor.props.globalOptions.default = () => myGlobalOptions;
// console.log(QuillEditor);

export default defineComponent({
  components: { QuillEditor },
  setup: () => {
    const content = ref<string>("");
    const myEditor = ref<any>();
    onMounted(() => {
      // console.log(myEditor.value);
      // myEditor.value.setHTML("<h1>Hooooiiii</h1>");
      // console.log(myEditor.value.getHTML());
      // myEditor.value.getQuill().setText("Damput");
      // myEditor.value
      //   .getQuill()
      //   .updateContents([{ insert: "kadofjadofiasjdfoi " }]);
    });

    const onEditorBlur = (editor) => {
      // console.log("EditorBlur", editor);
      // console.log("BLUR");
    };

    const onEditorFocus = (editor) => {
      // console.log("EditorFocus", editor);
      // console.log("FOCUS");
    };

    const onEditorReady = (quill: Quill) => {
      // console.log("EditorReady", quill);
      // quill.setText("Set this text when editor ready");
    };

    const onTextChange = (args) => {
      // console.log("TextChange", typeof args);
      // console.log("TextChange", args);
    };

    const onEditorChange = (args) => {
      if (args.name === "text-change") {
        // const { delta, oldContents, source } = args;
        // console.log("EditorChange", args);
        // console.log("EditorChange", delta, oldContents, source);
      }
      if (args.name === "selection-change") {
        // const { range, oldRange, source } = args;
        // console.log("EditorChange", args);
        // console.log("EditorChange", range, oldRange, source);
      }
    };

    const onSelectionChange = (args) => {
      // console.log("SelectionChange", typeof args);
      // console.log("SelectionChange", args[0]);
    };

    // const onSelectionChange = ({ range, oldRange, source }) => {
    //   console.log("SelectionChange", typeof range);
    //   console.log("SelectionChange", range.index, oldRange, source);
    // };

    return {
      myLocalOptions,
      myEditor,
      content,
      onEditorBlur,
      onEditorFocus,
      onEditorReady,
      onTextChange,
      onEditorChange,
      onSelectionChange,
    };
  },
});
</script>