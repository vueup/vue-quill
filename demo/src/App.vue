<template>
  <BasicExample />
  <AddModules />
  <ContentType />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BasicExample from './examples/BasicExample.vue'
import AddModules from './examples/AddModules.vue'
import ContentType from './examples/ContentType.vue'

export default defineComponent({
  name: 'App',
  components: {
    BasicExample,
    AddModules,
    ContentType,
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>