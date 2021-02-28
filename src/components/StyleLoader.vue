
<template>
  <div v-html="style"></div>
  <div>akdfjhaskdfhj</div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    theme: {
      type: String,
    },
  },
  setup: (props) => {
    const style = ref<string>("");
    const importTheme = async (): Promise<any> => {
      return import(`../themes/quill.${props.theme}`);
    };

    (async () => {
      const { theme } = await importTheme();
      style.value = theme;
    })();

    return { style };
  },
});
</script>
