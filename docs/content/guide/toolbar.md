# Toolbar
The toolbar module allow users to easily format Quill’s contents. It can be configured with a  [`toolbar` prop](../api/index.md#toolbar).

There are 3 ways to configure toolbar:

## Pre-Configure Toolbar Options

VueUpQuill provides 3 pre-configured toolbar options `essential`, `minimal`, `full`, and `""` to use default options.

~~~ vue
<template>
  <QuillEditor toolbar="minimal" .../>
</template>
~~~

## Custom Toolbar Options

You can also set your own options like this:

~~~ vue
<template>
  <QuillEditor :toolbar="['bold', 'italic', 'underline']" .../>
</template>
~~~

See [Quill toolbar docs](https://quilljs.com/docs/modules/toolbar/) for more details.

## Custom Toolbar Container

~~~ vue
<template>
  <QuillEditor toolbar="#my-toolbar" ...>
    <template #toolbar>
      <div id="my-toolbar">
        <!-- Add buttons as you would before -->
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>

        <!-- But you can also add your own -->
        <button id="custom-button"></button>
      </div>
    </template>
  </QuillEditor>
</template>
~~~

See [Quill toolbar docs](https://quilljs.com/docs/modules/toolbar/) for more details.