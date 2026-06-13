<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

withDefaults(
  defineProps<{
    modelValue?: boolean | 'indeterminate'
    label?: string
    disabled?: boolean
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
}>()
</script>

<template>
  <label
    :class="[
      'inline-flex items-center gap-1 text-sm select-none',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    ]"
  >
    <CheckboxRoot
      :id="id"
      :model-value="modelValue"
      :disabled="disabled"
      class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:bg-blue-600"
      @click.stop
      @update:model-value="emit('update:modelValue', $event)"
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
    <span v-if="label" class="text-gray-900">{{ label }}</span>
  </label>
</template>
