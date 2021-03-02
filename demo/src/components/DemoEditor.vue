<template>
  <!-- ============ DEMO ============ -->
  <div class="container mx-auto xl:px-24">
    <div class="grid grid-cols-2 gap-3">
      <header class="col-start-1 col-end-3">Snow</header>
      <QuillEditor
        ref="myEditor"
        class="h-60 bg-white"
        v-model:content="myContent"
        @ready="handleReady"
        @textChange="handleTextChange"
        theme="snow"
        toolbar="minimal"
      >
        <template #toolbar>
          <div>This is toolbar</div>
        </template>
      </QuillEditor>
      <!-- <Prism language="html" :code="myHTML"></Prism> -->
      <button @click="clickMe">Click</button>
    </div>
  </div>
</template>

<script lang="ts">
import Quill from "quill";
import { Delta } from "types-quill-delta";
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  setup: () => {
    const myEditor = ref();
    onMounted(() => {
      console.log(myEditor.value);
    });

    const myContent = ref([
      { insert: "Hello " },
      { insert: "World!", attributes: { bold: true } },
      { insert: "\n" },
    ]);
    const myHTML = ref<string>("");
    let myQuill: Quill | null = null;

    const handleReady = (quill) => {
      myQuill = quill;
    };

    const handleTextChange = (a: Delta, b: Delta, c: any) => {
      myHTML.value = myQuill?.root.innerHTML as string;
    };

    const clickMe = () => {
      myHTML.value = myQuill?.root.innerHTML as string;
      console.log(myQuill?.root.innerHTML);
    };

    return {
      myEditor,
      clickMe,
      myContent,
      myHTML,
      handleReady,
      handleTextChange,
    };
  },
});
</script>