<template>
  <QuillEditor
    v-model:content="myContent"
    @textChange="handleTextChange"
  ></QuillEditor>
  <p>{{ myContent }}</p>
</template>

<script lang="ts">
import { Delta } from "types-quill-delta";
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup: () => {
    const myContent = ref([
      { insert: "Hello " },
      { insert: "World!", attributes: { bold: true } },
      { insert: "\n" },
    ]);

    const handleTextChange = (a: Delta, b: Delta, c: any) => {
      console.log(a, b, c);
    };
    return { myContent, handleTextChange };
  },
});
</script>