<script setup lang="ts">
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from 'reka-ui'

import type { Option } from '../../types/core'

withDefaults(
  defineProps<{
    modelValue: string | number
    items: Option[]
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()
</script>

<template>
  <RadioGroupRoot
    :model-value="modelValue"
    class="flex items-center gap-2"
    @update:model-value="
      v => {
        emit('update:modelValue', v as string | number)
        emit('change', v as string | number)
      }
    "
  >
    <label
      v-for="({ value, label }, i) in items"
      :key="i"
      :class="[
        'inline-flex shrink-0 items-center gap-1 text-sm',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      ]"
    >
      <RadioGroupItem
        :id="'Radio-' + label"
        :value="`${value}`"
        :disabled="disabled"
        class="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none data-[state=checked]:border-blue-600"
      >
        <RadioGroupIndicator
          class="flex h-full w-full items-center justify-center after:block after:h-2 after:w-2 after:rounded-full after:bg-blue-600 after:content-['']"
        />
      </RadioGroupItem>
      <span v-if="label">{{ label }}</span>
    </label>
  </RadioGroupRoot>
</template>
