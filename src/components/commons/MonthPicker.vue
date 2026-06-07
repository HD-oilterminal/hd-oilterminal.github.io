<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useDragNav } from '../../composables/useDragNav'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
    format?: string
  }>(),
  {
    modelValue: '',
    format: 'YYYY-MM'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const today = new Date()

const currentYear = ref(
  props.modelValue ? parseInt(props.modelValue.split('-')[0]) : today.getFullYear()
)

watch(
  () => props.modelValue,
  val => {
    if (val) currentYear.value = parseInt(val.split('-')[0])
  }
)

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => {
    const monthStr = String(i + 1).padStart(2, '0')
    return {
      label: '',
      value: `${currentYear.value}-${monthStr}`,
      isSelected: props.modelValue === `${currentYear.value}-${monthStr}`,
      isToday: today.getFullYear() === currentYear.value && today.getMonth() === i
    }
  })
)

function select(value: string) {
  if (!props.disabled) emit('update:modelValue', value)
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => {
    currentYear.value++
  },
  () => {
    currentYear.value--
  }
)
</script>

<template>
  <div
    class="w-69 p-3 select-none"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @click.capture="onClickCapture"
    @wheel.prevent="onWheel"
  >
    <div class="mb-4 flex items-center justify-between">
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        @click="currentYear--"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <span class="text-sm font-semibold text-gray-900">{{ currentYear }}</span>
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        @click="currentYear++"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
    <div class="grid grid-cols-4 gap-y-1">
      <button
        v-for="month in months"
        :key="month.value"
        type="button"
        :disabled="disabled"
        :class="[
          'inline-flex h-9 w-full items-center justify-center rounded-md text-sm transition-colors',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-40',
          month.isSelected
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : month.isToday
              ? 'font-semibold text-blue-600 hover:bg-gray-100'
              : 'text-gray-900 hover:bg-gray-100'
        ]"
        @click="select(month.value)"
      >
        {{ month.label }}
      </button>
    </div>
  </div>
</template>
