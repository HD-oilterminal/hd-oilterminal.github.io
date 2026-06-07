<script setup lang="ts">
import { Label } from 'reka-ui'

withDefaults(
  defineProps<{
    for?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    for: ''
  }
)
</script>

<template>
  <Label
    :for="$props.for"
    :class="[
      'text-sm leading-none font-medium',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-default text-gray-700'
    ]"
  >
    <slot />
    <span v-if="required" class="ml-0.5 text-red-500">*</span>
  </Label>
</template>
