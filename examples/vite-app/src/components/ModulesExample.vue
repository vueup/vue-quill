<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
import BlotFormatter from 'quill-blot-formatter'
import { Delta } from '@vueup/vue-quill'
import { ref } from 'vue'

const modules = {
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {
    /* options */
  },
}
const content = ref<Delta>(
  new Delta([
    {
      insert: 'About Quill Blot Formatter',
    },
    {
      attributes: {
        header: 2,
      },
      insert: '\n',
    },
    {
      insert: '\n',
    },
    {
      attributes: {
        color: '#24292f',
      },
      insert:
        'A module for Quill that allows editor elements to be resized, repositioned, etc.',
    },
    {
      insert: '\nLink: ',
    },
    {
      attributes: {
        link: 'https://github.com/Fandom-OSS/quill-blot-formatter',
      },
      insert: 'https://github.com/Fandom-OSS/quill-blot-formatter',
    },
    {
      insert: '\n\n',
    },
    {
      attributes: {
        height: '188.13151041666666',
        width: '370',
      },
      insert: {
        image: 'https://picsum.photos/id/10/370/188',
      },
    },
    {
      insert: '\n',
    },
  ])
)
</script>

<template>
  <QuillEditor v-model:content="content" :modules="modules" toolbar="full" />
</template>

<style scoped>
.basic-example {
  height: 600px;
}
</style>
