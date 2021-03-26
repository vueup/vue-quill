<template>
  <!-- Two-way Data-Binding -->
  <div>
    <QuillEditor
      ref="myEditor"
      :theme="theme"
      toolbar="essential"
      placeholder="aodsifoaspdfjasdflkajsdfja props..."
      v-model:content="content"
      @textChange="onTextChange"
      @focus="focus = true"
      @blur="focus = false"
    />
  </div>
  <button @click="changeEditor">Change</button>
  <h2>{{ theme }}</h2>
  <pre>
    <code>
{{ content }}
    </code>
  </pre>
</template>

<script lang="ts">
/* tslint:disable:no-unused-variable */
import { Delta } from "types-quill-delta";
import { watch, defineComponent, ref } from "vue";
// import QuillEditor from "../../../dist/vue-quill.es";
import { QuillEditor } from "../../../src/main";

export default defineComponent({
  components: { QuillEditor },
  setup: () => {
    const content = ref<string | Delta>("");
    const myEditor = ref<any>();
    const focus = ref<any>();
    /* tslint:disable:no-unused-variable */
    // const onTextChange = (args) => {
    //   console.log("TextChange", typeof args);
    //   console.log("TextChange", args);
    // };

    const theme = ref("snow");
    const changeEditor = () => {
      theme.value = theme.value === "snow" ? "bubble" : "snow";
    };

    watch(theme, () => {
      // console.log(myEditor.value.getHTML());
      // console.log(myEditor.value.getQuill().focus());
      console.log(myEditor.value.reinit());
      console.log("trigger", theme.value);
    });

    return {
      theme,
      changeEditor,
      focus,
      myEditor,
      content,
      // onTextChange,
    };
  },
});
</script>