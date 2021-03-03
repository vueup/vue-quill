<template>
  <QuillEditor
    ref="myEditor"
    class="h-60 bg-white"
    theme="snow"
    toolbar="#toolbar"
  >
    <template #toolbar>
      <div id="toolbar">
        <!-- Add font size dropdown -->
        <select class="ql-size">
          <option value="small"></option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <!-- Add a bold button -->
        <button class="ql-bold bg-red-500 hover:bg-red-500"></button>
        <!-- Add subscript and superscript buttons -->
        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
      </div>
    </template>
  </QuillEditor>
</template>
