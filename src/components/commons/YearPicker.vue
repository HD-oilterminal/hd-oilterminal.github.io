<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { DatePickerField, DatePickerInput, DatePickerRoot } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDragNav } from '../../composables/useDragNav'
import { dateString, pad, toDate } from '../../composables/useFormat'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
  }>(),
  { modelValue: '' }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { locale } = useI18n()

const internalValue = ref<DateValue | undefined>(toDate(props.modelValue, 'YYYY'))
const currentYear = new Date().getFullYear()
const viewPageStart = ref(Math.floor((internalValue.value?.year ?? currentYear) / 12) * 12)
const isOpen = ref(false)
const yearInput = ref()

const onUpdate = (value: DateValue | undefined) => {
  internalValue.value = value as CalendarDate | undefined
  emit('update:modelValue', value ? dateString(value, 'YYYY') : '')
}

const selectYear = (year: number) => {
  const val = new CalendarDate(year, 1, 1)
  internalValue.value = val
  emit('update:modelValue', dateString(val, 'YYYY'))
  isOpen.value = false
}

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  if (!e.relatedTarget || !wrapper.contains(e.relatedTarget as Node)) {
    const yearPh = yearInput.value?.$el?.textContent?.trim() === '____'

    if (!yearPh && !internalValue.value) {
      const year = Number(yearInput.value.$el.textContent?.trim())
      if (year > 0) {
        const val = new CalendarDate(year, 1, 1)
        internalValue.value = val
        emit('update:modelValue', dateString(val, 'YYYY'))
      } else {
        internalValue.value = undefined
        emit('update:modelValue', '')
      }
    } else if (yearPh && internalValue.value) {
      internalValue.value = undefined
      emit('update:modelValue', '')
    }

    isOpen.value = false
  }
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => (viewPageStart.value -= 12),
  () => (viewPageStart.value += 12)
)

//
const years = computed(() => Array.from({ length: 12 }, (_, i) => viewPageStart.value + i))

watch(
  () => props.modelValue,
  val => {
    const next = toDate(val, 'YYYY')
    if (next?.toString() !== internalValue.value?.toString()) {
      internalValue.value = next
      if (next) viewPageStart.value = Math.floor(next.year / 12) * 12
    }
  }
)

watch(internalValue, val => {
  if (val) viewPageStart.value = Math.floor(val.year / 12) * 12
})
</script>

<template>
  <div
    class="relative inline-block"
    @focusout="onFocusOut"
    @keydown="(e: KeyboardEvent) => ['Escape', 'Enter'].includes(e.key) && (isOpen = false)"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
  >
    <DatePickerRoot
      v-model:open="isOpen"
      :model-value="internalValue as DateValue"
      :disabled="disabled"
      :locale="locale"
      granularity="day"
      @update:model-value="onUpdate"
    >
      <DatePickerField
        v-slot="{ segments }"
        class="h-control-md inline-flex min-w-16 items-center rounded-md border border-gray-300 bg-white pl-1 text-sm focus-within:ring-2 focus-within:ring-blue-500"
        :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
        @focusin="isOpen = true"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          color="#ccc"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
        <DatePickerInput
          ref="yearInput"
          part="year"
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-300 data-placeholder:text-gray-400"
        >
          {{ pad(segments.find(s => s.part === 'year')?.value, '____', 4) }}
        </DatePickerInput>
      </DatePickerField>

      <div
        v-if="isOpen"
        class="absolute top-full left-0 z-50 w-52 rounded-md border border-gray-200 bg-white p-3 shadow-lg select-none"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @click.capture="onClickCapture"
        @wheel.prevent="onWheel"
      >
        <div class="mb-3 flex items-center justify-between">
          <button
            type="button"
            tabindex="-1"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
            @mousedown.prevent
            @click="viewPageStart -= 12"
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
          <span class="text-sm font-semibold text-gray-900">{{ viewPageStart }} – {{ viewPageStart + 11 }}</span>
          <button
            type="button"
            tabindex="-1"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
            @mousedown.prevent
            @click="viewPageStart += 12"
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
        <div class="grid grid-cols-3 gap-1">
          <button
            v-for="year in years"
            :key="year"
            type="button"
            tabindex="-1"
            :class="[
              'rounded px-1 py-1.5 text-sm transition-colors',
              internalValue?.year === year ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'
            ]"
            @mousedown.prevent
            @click="selectYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </DatePickerRoot>
  </div>
</template>
