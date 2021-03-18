<template></template>

<script>
import { defineComponent, onMounted } from "vue";
import { getLatestReleaseVersion } from "../utils/github-api";

export default defineComponent({
  setup: () => {
    onMounted(async () => {
      const latestVersion = await getLatestReleaseVersion(
        "vueup",
        "vueup-quill"
      );
      document.getElementById(
        "cdn-install"
      ).innerHTML = document
        .getElementById("cdn-install")
        .innerHTML.replace(/\$latest/g, latestVersion);
    });
  },
});
</script>
