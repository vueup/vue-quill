<template>
  <!-- <EventHandler /> -->
  <DeltaContent />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EventHandler from "./components/EventHandler.vue";
import DeltaContent from "./components/DeltaContent.vue";

export default defineComponent({
  name: "App",
  components: {
    EventHandler,
    DeltaContent,
  },
});
</script>
