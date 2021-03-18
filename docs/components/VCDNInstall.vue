<template></template>

<script>
import { defineComponent, onMounted } from "vue";
// import { request } from "@octokit/request";
import { request } from "https://cdn.skypack.dev/@octokit/request";

export const getLatestReleaseVersion = async (owner, repo) => {
  const res = await request(`GET /repos/${owner}/${repo}/releases/latest`, {
    owner,
    repo,
  });
  return res.data.tag_name.replace("v", "");
  // return "2";
};

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
      // console.log("Mounted");
    });
  },
});
</script>
