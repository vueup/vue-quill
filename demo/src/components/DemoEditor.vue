<template>
  <div class="container mx-auto xl:px-24 text-gray-700">
    <div class="flex gap-3">
      <!-- Theme and Toolbar menu -->
      <div class="flex flex-col w-28">
        <div class="text-sm text-gray-400 font-bold mb-2">THEME</div>
        <div class="flex flex-col gap-2 mb-4">
          <Options
            name="theme"
            v-model:selected="selectedTheme"
            :options="[
              { value: 'snow', label: 'Snow' },
              { value: 'bubble', label: 'Bubble' },
            ]"
          ></Options>
        </div>
        <div class="text-sm text-gray-400 font-bold mb-2">TOOLBAR</div>
        <div class="flex flex-col gap-2 mb-4">
          <Options
            name="toolbar"
            v-model:selected="selectedToolbar"
            :options="[
              { value: 'default', label: 'Default' },
              { value: 'minimal', label: 'Minimal' },
              { value: 'full', label: 'Full' },
            ]"
          ></Options>
        </div>
      </div>
      <div class="flex-1 bg-white shadow-md">
        <QuillEditor
          ref="myEditor"
          class="h-80 bg-white flex-1"
          v-model:content="myContent"
          @ready="handleReady"
          @textChange="handleTextChange"
          :theme="selectedTheme"
          :toolbar="selectedToolbar"
        >
        </QuillEditor>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Quill from "quill";
import { Delta } from "types-quill-delta";
import { defineComponent, onMounted, ref } from "vue";
import CustomToolbar from "./examples/CustomToolbar.vue";
import Options from "./Options.vue";

export default defineComponent({
  components: {
    CustomToolbar,
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
    const selectedToolbar = ref<string>("default");

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