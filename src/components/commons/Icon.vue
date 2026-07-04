<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: number
    filled?: boolean
    weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700
  }>(),
  { size: 20, filled: false, weight: 200 }
)
</script>

<template>
  <span
    class="material-symbols-outlined leading-none select-none"
    :style="{
      fontSize: `${size}px`,
      fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}`
    }"
    aria-hidden="true"
    >{{ name }}</span
  >
</template>
