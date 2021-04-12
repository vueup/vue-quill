<template>
  <BasicExample />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BasicExample from './components/BasicExample.vue'

export default defineComponent({
  name: 'App',
  components: {
    BasicExample,
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