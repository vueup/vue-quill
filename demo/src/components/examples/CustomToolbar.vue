<template>
  <Options
    name="theme2"
    v-model:selected="selectedTheme"
    :options="[
      { value: 'snow', label: 'Snow' },
      { value: 'bubble', label: 'Bubble' },
      { value: '', label: 'None' },
    ]"
  ></Options>
  <div class="wrapper">
    <QuillEditor
      v-model:content="myContent"
      ref="myEditor"
      class="h-60 bg-white"
      :theme="selectedTheme"
      toolbar="#toolbar"
    >
      <template #toolbar>
        <div id="toolbar">
          <!-- Add font size dropdown -->
          <select class="ql-size">
            <option value="small"></option>
            <!-- Note a missing, thus falsy value, is used to reset to default -->
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
          <!-- Add a bold button -->
          <button class="ql-bold"></button>
          <!-- Add subscript and superscript buttons -->
          <button class="ql-script" value="sub"></button>
          <button class="ql-script" value="super"></button>
        </div>
      </template>
    </QuillEditor>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Options from "../Options.vue";
export default defineComponent({
  components: {
    Options,
  },
  setup: () => {
    return {
      selectedTheme: ref<string>("snow"),
      myContent: ref<string>("snow"),
    };
  },
});
</script>
