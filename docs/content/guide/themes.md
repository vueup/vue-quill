# Themes

Quill features two officially supported themes: `snow` and `bubble` see [DEMO](https://vueup.github.io/vue-quill/).
Themes primarily control the visual look of Quill through its CSS stylesheet, and many changes can easily be made by overriding these rules. At the very least, the `core` theme must be included for modules like toolbars or tooltips to work.

To activate a theme, import the stylesheet for the themes you want to use.

~~~ javascript
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// OR | AND
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
// you can use both themes at the same time and use them interchangeably
~~~

These stylesheets can be found in the Quill distribution, but for convenience, they are also linked in VueQuill's `dist` folder.

Then, pass the name of the theme to the [`theme prop`](../api/props.md).

~~~ vue
<template>
  <QuillEditor theme="snow" .../>

  <!-- you can bind :theme and it will automatically re render when its value change -->
  <QuillEditor :theme="value" .../>
</template>
~~~