<script setup lang="ts">
defineProps<{
  label?: string
  variant?: 'primary' | 'secondary' | 'liner' | 'ghost' | 'united' | 'none'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

defineEmits<{ click: [event: MouseEvent] }>()

const el = ref<HTMLButtonElement>()

defineExpose({ focus: () => el.value?.focus() })
</script>

<template>
  <button
    ref="el"
    :disabled="disabled"
    :class="[
      'btn inline-flex items-center justify-center rounded font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
      {
        sm: 'h-control-sm px-2 text-sm',
        md: 'h-control-md px-3 text-sm',
        lg: 'h-12 px-5 text-base'
      }[size ?? 'md'],
      {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        liner: 'border border-gray-300 text-gray-500 hover:bg-gray-100',
        ghost: 'border border-gray-200 text-gray-700 hover:bg-gray-100',
        united: 'absolute right-0 px-2! text-gray-700 hover:bg-gray-200/70',
        none: 'px-0!'
      }[variant ?? 'primary'],
      [disabled ? 'cursor-not-allowed' : 'cursor-pointer']
    ]"
    :type="type ?? 'button'"
    @click="$emit('click', $event)"
  >
    {{ label }}<slot />
  </button>
</template>
