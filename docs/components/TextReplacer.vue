<script setup type="ts">
import { watch, onMounted } from "vue";
import { escapeRegExp } from "../utils/regex";
const props = defineProps({
  container: {
    type: String,
    default: "body",
  },
  pattern: {
    type: String,
    required: true,
  },
  replacement: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: "",
  },
  suffix: {
    type: String,
    default: "",
  },
})
const replaceDomText = (container, pattern, replacement) => {
  pattern = new RegExp(escapeRegExp(pattern), "g");
  document.querySelectorAll(container).forEach((el) => {
    el.innerHTML = el.innerHTML.replace(pattern, replacement);
  });
};

let replacedText;
onMounted(() => {
  watch(
    () => props.replacement,
    (value) => {
      if (props.replacement && props.replacement !== "") {
        const pattern = replacedText ? replacedText : props.pattern;
        const replacement = props.prefix + value + props.suffix;
        replaceDomText(props.container, pattern, replacement);
        replacedText = replacement;
      }
    },
    { immediate: true }
  );
});
</script>

<template></template>
