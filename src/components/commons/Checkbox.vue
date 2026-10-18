<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean | 'indeterminate' | 'Y' | 'N'
    label?: string
    disabled?: boolean
    readonly?: boolean
    id?: string
  }>(),
  {
    modelValue: false,
    label: '',
    id: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
  change: [value: boolean | 'indeterminate']
}>()

const onUpdate = (value: boolean | 'indeterminate' | 'Y' | 'N') => {
  if ('Y' === value) value = true
  if ('N' === value) value = false

  emit('update:modelValue', value)
  emit('change', value)
}

watch(
  () => props.modelValue,
  value => {
    if ('Y' === value) emit('update:modelValue', true)
    if ('N' === value) emit('update:modelValue', false)
  },
  { immediate: true }
)
</script>

<template>
  <label
    :class="[
      'inline-flex shrink-0 items-center gap-1 select-none',
      disabled ? 'cursor-not-allowed opacity-50' : '',
      readonly ? 'cursor-not-allowed' : ''
    ]"
  >
    <CheckboxRoot
      :id="id"
      :model-value="'Y' === modelValue ? true : 'N' === modelValue ? false : modelValue"
      :disabled="disabled || readonly"
      class="flex h-4 w-4 items-center justify-center rounded border border-gray-300 bg-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:bg-blue-600"
      @click.stop
      @update:model-value="onUpdate"
    >
      <CheckboxIndicator
        :force-mount="true"
        class="flex h-4 w-4 items-center justify-center text-white data-[state=unchecked]:invisible"
      >
        <svg v-if="modelValue === 'indeterminate'" width="10" height="2" viewBox="0 0 10 2" fill="currentColor">
          <rect width="10" height="2" rx="1" />
        </svg>
        <svg
          v-else
          width="10"
          height="8"
          viewBox="0 0 10 8"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m1 4 3 3 5-6" />
        </svg>
      </CheckboxIndicator>
    </CheckboxRoot>
    <span v-if="label" class="-ml-0.5 text-gray-900">{{ label }}</span>
  </label>
</template>
