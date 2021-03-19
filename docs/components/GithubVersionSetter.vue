<template></template>

<script>
import { defineComponent, onMounted } from "vue";
import { getLatestReleaseVersion } from "../utils/github-api";
import { escapeRegExp } from "../utils/regex";

export default defineComponent({
  props: {
    container: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    repo: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      default: "$latestVersion",
    },
  },
  setup: (props) => {
    onMounted(async () => {
      const latestVersion = await getLatestReleaseVersion(
        props.owner,
        props.repo
      );
      let pattern = new RegExp(escapeRegExp(props.target), "g");
      document.querySelectorAll(props.container).forEach((el) => {
        el.innerHTML = el.innerHTML.replace(pattern, latestVersion);
      });
    });
  },
});
</script>
