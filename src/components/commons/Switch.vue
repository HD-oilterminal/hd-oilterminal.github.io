<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

withDefaults(
  defineProps<{
    modelValue?: boolean
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
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label
    :class="[
      'inline-flex select-none items-center gap-2',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
    ]"
  >
    <SwitchRoot
      :id="id"
      :checked="modelValue"
      :disabled="disabled"
      class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:pointer-events-none data-[state=checked]:bg-blue-600"
      @update:checked="emit('update:modelValue', $event)"
    >
      <SwitchThumb
        class="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      />
    </SwitchRoot>
    <span v-if="label" class="text-sm text-gray-900">{{ label }}</span>
  </label>
</template>
