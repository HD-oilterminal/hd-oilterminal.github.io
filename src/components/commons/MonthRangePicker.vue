<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useDragNav } from '../../composables/useDragNav'

interface MonthRange {
  start?: string // YYYY-MM
  end?: string // YYYY-MM
}

const props = withDefaults(
  defineProps<{
    modelValue?: MonthRange
    disabled?: boolean
    locale?: string
  }>(),
  { modelValue: undefined, locale: 'ko' }
)

const emit = defineEmits<{
  'update:modelValue': [value: MonthRange]
}>()

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

const currentYear = ref(
  props.modelValue?.start ? parseInt(props.modelValue.start.split('-')[0]) : today.getFullYear()
)

const anchor = ref<string>()
const hoverValue = ref<string>()

watch(
  () => props.modelValue,
  val => {
    anchor.value = undefined
    hoverValue.value = undefined
    if (val?.start) currentYear.value = parseInt(val.start.split('-')[0])
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

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => {
    const monthStr = String(i + 1).padStart(2, '0')
    const value = `${currentYear.value}-${monthStr}`
    const isStart = value === rangeStart.value
    const isEnd = value === rangeEnd.value
    const inRange = !!(
      rangeStart.value &&
      rangeEnd.value &&
      value > rangeStart.value &&
      value < rangeEnd.value
    )
    return {
      label: new Intl.DateTimeFormat(props.locale, { month: 'short' }).format(
        new Date(currentYear.value, i, 1)
      ),
      value,
      isStart,
      isEnd,
      inRange,
      isToday: value === todayStr
    }
  })
)

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
    currentYear.value++
  },
  () => {
    currentYear.value--
  }
)
</script>

<template>
  <div
    class="w-[276px] p-3 select-none"
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
          'inline-flex h-9 w-full items-center justify-center text-sm transition-colors',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-40',
          month.isStart && month.isEnd
            ? 'rounded-md bg-blue-600 text-white hover:bg-blue-700'
            : month.isStart
              ? 'rounded-l-md bg-blue-600 text-white hover:bg-blue-700'
              : month.isEnd
                ? 'rounded-r-md bg-blue-600 text-white hover:bg-blue-700'
                : month.inRange
                  ? 'rounded-none bg-blue-100 text-gray-900 hover:bg-blue-200'
                  : month.isToday
                    ? 'rounded-md font-semibold text-blue-600 hover:bg-gray-100'
                    : 'rounded-md text-gray-900 hover:bg-gray-100'
        ]"
        @click="handleClick(month.value)"
        @mouseenter="handleMouseEnter(month.value)"
      >
        {{ month.label }}
      </button>
    </div>
  </div>
</template>
