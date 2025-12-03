<script setup lang="ts"></script>

<template>
  <div class="loading">
    <span>L</span>
    <span>o</span>
    <span>a</span>
    <span>d</span>
    <span>i</span>
    <span>n</span>
    <span>g</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
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
.loading span:nth-child(2) {
  animation-delay: 0.1s;
}
.loading span:nth-child(3) {
  animation-delay: 0.2s;
}
.loading span:nth-child(4) {
  animation-delay: 0.3s;
}
.loading span:nth-child(5) {
  animation-delay: 0.4s;
}
.loading span:nth-child(6) {
  animation-delay: 0.5s;
}
.loading span:nth-child(7) {
  animation-delay: 0.6s;
}
.loading span:nth-child(8) {
  animation-delay: 0.7s;
}
.loading span:nth-child(9) {
  animation-delay: 0.8s;
}
.loading span:nth-child(10) {
  animation-delay: 0.9s;
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
