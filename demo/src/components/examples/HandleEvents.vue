<template>
  <!-- Two-way Data-Binding -->
  <div>
    <QuillEditor
      ref="myEditor"
      theme="snow"
      toolbar=""
      v-model:content="content"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @ready="onEditorReady"
      @textChange="onTextChange"
      @editorChange="onEditorChange"
      @selectionChange="onSelectionChange"
    />
  </div>
</template>

<script lang="ts">
import Vue, { defineComponent, onMounted, ref } from "vue";
import { Quill, QuillEditor } from "../../../../src/main";
export default defineComponent({
  setup: () => {
    const content = ref<string>("Holala...");
    const myEditor = ref<any>();
    onMounted(() => {
      // console.log(myEditor.value);
      myEditor.value.setHTML("<h1>Hooooiiii</h1>")
      console.log(myEditor.value.getHTML())
      myEditor.value.getQuill().setText("Damput")
      myEditor.value.getQuill().updateContents([{insert: "kadofjadofiasjdfoi "}])
    });

    const onEditorBlur = (args) => {
      // console.log("EditorBlur", args);
    };

    const onEditorFocus = (editor) => {
      // console.log("EditorFocus", editor);
    };

    const onEditorReady = (quill: Quill) => {
      // console.log("EditorReady", quill);
      // quill.setText("Set this text when editor ready");
    };

    const onTextChange = (args) => {
      // console.log("TextChange", args);
    };

    const onEditorChange = (args) => {
      // console.log("EditorChange", args);
    };

    const onSelectionChange = (args) => {
      // console.log("SelectionChange", args);
    };

    return {
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