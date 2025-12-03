<script setup lang="ts">
const chars = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.']
</script>

<template>
  <div class="loading">
    <span
      v-for="(char, index) in chars"
      :key="index"
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      {{ char }}
    </span>
  </div>
</template>

<style scoped>
.loading {
  text-align: left;
}

.loading span {
  display: inline-block;
  padding-right: 0.1em;
  margin: 0 -0.075em;
  animation: loading 0.7s infinite alternate;
}

@keyframes loading {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}
</style>
