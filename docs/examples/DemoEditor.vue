<template>
  <div class="flex flex-col md:flex-row gap-3">
    <!-- Theme and Toolbar menu -->
    <div class="flex flex-col w-28">
      <div class="text-sm text-gray-400 font-bold mb-2">THEME</div>
      <div class="flex md:flex-col gap-2 mb-4">
        <Options
          name="theme"
          v-model:selected="selectedTheme"
          :options="[
            { value: 'snow', label: 'Snow' },
            { value: 'bubble', label: 'Bubble' },
            { value: '', label: 'None' },
          ]"
        ></Options>
      </div>
      <div class="text-sm text-gray-400 font-bold mb-2">TOOLBAR</div>
      <div class="flex md:flex-col gap-2 mb-4">
        <Options
          name="toolbar"
          v-model:selected="selectedToolbar"
          :options="[
            { value: 'essential', label: 'Essential' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'full', label: 'Full' },
            { value: '', label: 'None' },
          ]"
        ></Options>
      </div>
    </div>
    <div class="flex-1 flex flex-col">
      <QuillEditor
        ref="myEditor"
        class="h-80 flex-1"
        v-model:content="myContent"
        @ready="handleReady"
        @textChange="handleTextChange"
        :theme="selectedTheme"
        :toolbar="selectedToolbar"
      >
      </QuillEditor>
    </div>
  </div>
</template>

<script lang="ts">
import { Quill } from "../../src/main";

import { Delta } from "types-quill-delta";
import { defineComponent, onMounted, ref } from "vue";
import Options from "./Options.vue";

export default defineComponent({
  components: {
    Options,
  },
  setup: () => {
    const myEditor = ref();
    onMounted(() => {
      // console.log(myEditor.value);
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

    // ============ OPTIONS =====================
    const selectedTheme = ref<string>("snow");
    const selectedToolbar = ref<string>("essential");

    return {
      selectedTheme,
      selectedToolbar,
      // ---------------
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