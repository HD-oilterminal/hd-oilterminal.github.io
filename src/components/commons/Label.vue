<script setup lang="ts">
import { Label } from 'reka-ui'

withDefaults(
  defineProps<{
    for?: string
    required?: boolean
    text?: string
    textSize?: string
  }>(),
  {
    for: '',
    text: '',
    textSize: '8rem'
  }
)
</script>

<template>
  <Label
    :for="$props.for || undefined"
    class="hdot-label flex flex-1 items-center gap-2 text-sm font-medium"
  >
    <span
      :class="required ? 'required' : ''"
      class="shrink-0 text-right"
      :style="{ width: textSize }"
      >{{ text }}</span
    >
    <slot />
  </Label>
</template>

<style scoped>
span.required::before {
  content: '*';
  color: var(--color-red-500);
  margin-right: var(--spacing);
}
</style>
