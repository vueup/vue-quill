<script setup lang="ts">
interface Option {
  value: string
  label: string
}

interface Props {
  selected?: string
  name: string
  options?: Option[]
}

const props = withDefaults(defineProps<Props>(), {
  selected: '',
  options: () => [{ value: '1', label: 'Option 1' }],
})

const emit = defineEmits<{
  'update:selected': [value: string]
}>()

const localValue = defineModel<string>('selected')
</script>

<template>
  <div v-for="(option, index) in options" :key="index">
    <label class="inline-flex items-center cursor-pointer w-full">
      <input
        v-model="localValue"
        type="radio"
        class="form-radio bg-gray-200"
        :name="name"
        :value="option.value"
        :checked="option.value === localValue"
      />
      <span class="ml-2">{{ option.label }}</span>
    </label>
  </div>
</template>
