<template>
  <!-- ============ DEMO ============ -->
  <div class="container mx-auto xl:px-24">
    <div class="grid grid-cols-2 gap-3">
      <header class="col-start-1 col-end-3">Snow</header>
      <QuillEditor
        class="h-60 bg-white"
        v-model:content="myContent"
        @ready="handleReady"
        @textChange="handleTextChange"
        theme="snow"
        toolbar="minimal"
      >
      </QuillEditor>
      <!-- <Prism language="html" :code="myHTML"></Prism> -->
      <button @click="clickMe">Click</button>
    </div>
  </div>
</template>