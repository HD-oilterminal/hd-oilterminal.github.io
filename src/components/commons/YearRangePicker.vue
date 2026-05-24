<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useDragNav } from '../../composables/useDragNav'

interface YearRange {
  start?: string // YYYY
  end?: string // YYYY
}

const props = withDefaults(
  defineProps<{
    modelValue?: YearRange
    disabled?: boolean
  }>(),
  { modelValue: undefined }
)

const emit = defineEmits<{
  'update:modelValue': [value: YearRange]
}>()

const today = new Date()

const pageStart = ref(
  Math.floor(
    (props.modelValue?.start ? parseInt(props.modelValue.start) : today.getFullYear()) / 12
  ) * 12
)

const anchor = ref<string>()
const hoverValue = ref<string>()

watch(
  () => props.modelValue,
  (val) => {
    anchor.value = undefined
    hoverValue.value = undefined
    if (val?.start) pageStart.value = Math.floor(parseInt(val.start) / 12) * 12
  }
)

const rangeStart = computed(() => {
  if (anchor.value) {
    const other = hoverValue.value ?? anchor.value
    return anchor.value <= other ? anchor.value : other
  }
  return props.modelValue?.start
})

const rangeEnd = computed(() => {
  if (anchor.value) {
    const other = hoverValue.value ?? anchor.value
    return anchor.value <= other ? other : anchor.value
  }
  return props.modelValue?.end
})

const years = computed(() =>
  Array.from({ length: 12 }, (_, i) => {
    const value = String(pageStart.value + i)
    const isStart = value === rangeStart.value
    const isEnd = value === rangeEnd.value
    const inRange = !!(
      rangeStart.value &&
      rangeEnd.value &&
      value > rangeStart.value &&
      value < rangeEnd.value
    )
    return {
      label: value,
      value,
      isStart,
      isEnd,
      inRange,
      isToday: today.getFullYear() === pageStart.value + i
    }
  })
)

const pageLabel = computed(() => `${pageStart.value} – ${pageStart.value + 11}`)

function handleClick(value: string) {
  if (props.disabled) return
  if (!anchor.value) {
    anchor.value = value
  } else {
    const [start, end] = anchor.value <= value ? [anchor.value, value] : [value, anchor.value]
    anchor.value = undefined
    hoverValue.value = undefined
    emit('update:modelValue', { start, end })
  }
}

function handleMouseEnter(value: string) {
  if (anchor.value) hoverValue.value = value
}

function handleMouseLeave() {
  hoverValue.value = undefined
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => {
    pageStart.value += 12
  },
  () => {
    pageStart.value -= 12
  }
)
</script>

<template>
  <div
    class="w-[276px] select-none p-3"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @click.capture="onClickCapture"
    @wheel.prevent="onWheel"
    @mouseleave="handleMouseLeave"
  >
    <div class="mb-4 flex items-center justify-between">
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        @click="pageStart -= 12"
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
      <span class="text-sm font-semibold text-gray-900">{{ pageLabel }}</span>
      <button
        type="button"
        :disabled="disabled"
        class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        @click="pageStart += 12"
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
        v-for="year in years"
        :key="year.value"
        type="button"
        :disabled="disabled"
        :class="[
          'inline-flex h-9 w-full items-center justify-center text-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:pointer-events-none disabled:opacity-40',
          year.isStart && year.isEnd
            ? 'rounded-md bg-blue-600 text-white hover:bg-blue-700'
            : year.isStart
              ? 'rounded-l-md bg-blue-600 text-white hover:bg-blue-700'
              : year.isEnd
                ? 'rounded-r-md bg-blue-600 text-white hover:bg-blue-700'
                : year.inRange
                  ? 'rounded-none bg-blue-100 text-gray-900 hover:bg-blue-200'
                  : year.isToday
                    ? 'rounded-md font-semibold text-blue-600 hover:bg-gray-100'
                    : 'rounded-md text-gray-900 hover:bg-gray-100'
        ]"
        @click="handleClick(year.value)"
        @mouseenter="handleMouseEnter(year.value)"
      >
        {{ year.label }}
      </button>
    </div>
  </div>
</template>
