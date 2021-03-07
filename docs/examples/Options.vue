<template>
  <div v-for="(option, index) in options" :key="index">
    <label class="inline-flex items-center cursor-pointer w-full">
      <input
        type="radio"
        class="form-radio bg-gray-200"
        v-bind="$attrs"
        :name="name"
        :value="option.value"
        :checked="option.value === localValue"
        v-model="localValue"
      />
      <span class="ml-2">{{ option.label }}</span>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    selected: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      default: "option",
    },
    options: {
      type: Array,
      default: [{ value: "1", label: "Option 1" }],
    },
  },
  emits: ["update:selected"],
  setup: (props, ctx) => {
    const localValue = computed({
      get: () => props.selected,
      set: (value) => ctx.emit("update:selected", value),
    });
    return {
      localValue,
    };
  },
});
</script>