<script setup lang="ts">
defineProps<{
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
      {
        sm: 'h-control-sm px-3 text-sm',
        md: 'h-control-md px-4 text-sm',
        lg: 'h-12 px-6 text-base'
      }[size ?? 'md'],
      {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'text-gray-700 hover:bg-gray-100'
      }[variant ?? 'primary']
    ]"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>
