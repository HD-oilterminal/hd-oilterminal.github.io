<script setup lang="ts">
import { CalendarDateTime, type DateValue } from '@internationalized/date'
import dayjs from 'dayjs'
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerField,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerInput,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot
} from 'reka-ui'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDragNav } from '../../composables/useDragNav'
import { dateString, pad, padTime } from '../../composables/useFormat'

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

const toDateTime = (val?: string): CalendarDateTime | undefined => {
  if (!val) return undefined
  const d = dayjs(val, 'YYYY-MM-DD HH:mm', true)
  if (!d.isValid()) return undefined
  return new CalendarDateTime(d.year(), d.month() + 1, d.date(), d.hour(), d.minute())
}

const internalValue = ref<DateValue | undefined>(toDateTime(props.modelValue))
const isOpen = ref(false)
const yearInput = ref()
const monthInput = ref()
const dayInput = ref()
const hourInput = ref()
const minuteInput = ref()
const prev = ref()
const next = ref()

const onUpdate = (value?: DateValue) => {
  internalValue.value = value as CalendarDateTime | undefined
  emit('update:modelValue', value ? dateString(value, 'YYYY-MM-DD HH:mm') : '')
}

const onBackspace = (e: KeyboardEvent) => {
  if (e.key !== 'Backspace') return
  const focused = document.activeElement
  if (focused === minuteInput.value?.$el && minuteInput.value.$el.textContent?.trim() === '__') {
    e.preventDefault()
    hourInput.value.$el.focus()
  } else if (focused === hourInput.value?.$el && hourInput.value.$el.textContent?.trim() === '__') {
    e.preventDefault()
    dayInput.value.$el.focus()
  } else if (focused === dayInput.value?.$el && dayInput.value.$el.textContent?.trim() === '__') {
    e.preventDefault()
    monthInput.value.$el.focus()
  } else if (focused === monthInput.value?.$el && monthInput.value.$el.textContent?.trim() === '__') {
    e.preventDefault()
    yearInput.value.$el.focus()
  }
}

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  if (!e.relatedTarget || !wrapper.contains(e.relatedTarget as Node)) {
    const yearPh = yearInput.value?.$el?.textContent?.trim() === '____'
    const monthPh = monthInput.value?.$el?.textContent?.trim() === '__'
    const dayPh = dayInput.value?.$el?.textContent?.trim() === '__'
    const hourPh = hourInput.value?.$el?.textContent?.trim() === '__'
    const minutePh = minuteInput.value?.$el?.textContent?.trim() === '__'
    const allEmpty = yearPh && monthPh && dayPh && hourPh && minutePh
    const allFilled = !yearPh && !monthPh && !dayPh && !hourPh && !minutePh
    if (!allEmpty && !allFilled) {
      internalValue.value = undefined
      emit('update:modelValue', '')
    }
    isOpen.value = false
  }
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => prev.value?.$el.click(),
  () => next.value?.$el.click()
)

//
watch(
  () => props.modelValue,
  val => {
    const next = toDateTime(val)
    if (next?.toString() !== internalValue.value?.toString()) internalValue.value = next
  }
)
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
      granularity="minute"
      :hour-cycle="24"
      close-on-select
      @update:model-value="onUpdate"
    >
      <DatePickerField
        v-slot="{ segments }"
        class="h-control-md inline-flex min-w-45 items-center rounded-md border border-gray-300 bg-white pl-1 text-sm focus-within:ring-2 focus-within:ring-blue-500"
        :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
        @focusin="isOpen = true"
        @keydown="onBackspace"
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
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-200 data-placeholder:text-gray-400"
        >
          {{ pad(segments.find(s => s.part === 'year')?.value, '____') }}
        </DatePickerInput>
        <span class="mx-[-2px] text-gray-500 select-none">-</span>
        <DatePickerInput
          ref="monthInput"
          part="month"
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-200 data-placeholder:text-gray-400"
        >
          {{ pad(segments.find(s => s.part === 'month')?.value, '__', 2) }}
        </DatePickerInput>
        <span class="mx-[-2px] text-gray-500 select-none">-</span>
        <DatePickerInput
          ref="dayInput"
          part="day"
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-200 data-placeholder:text-gray-400"
        >
          {{ pad(segments.find(s => s.part === 'day')?.value, '__', 2) }}
        </DatePickerInput>
        <DatePickerInput
          ref="hourInput"
          part="hour"
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-200 data-placeholder:text-gray-400"
        >
          {{ padTime(segments.find(s => s.part === 'hour')?.value, '__') }}
        </DatePickerInput>
        <span class="mx-[-2px] text-gray-500 select-none">:</span>
        <DatePickerInput
          ref="minuteInput"
          part="minute"
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-200 data-placeholder:text-gray-400"
        >
          {{ padTime(segments.find(s => s.part === 'minute')?.value, '__') }}
        </DatePickerInput>
      </DatePickerField>

      <div v-if="isOpen" class="absolute top-full left-0 z-50 rounded-md border border-gray-200 bg-white shadow-lg">
        <DatePickerCalendar
          v-slot="{ grid, weekDays }"
          class="p-3 select-none"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @click.capture="onClickCapture"
          @wheel.prevent="onWheel"
        >
          <DatePickerHeader class="mb-4 flex items-center justify-between">
            <DatePickerPrev
              ref="prev"
              tabindex="-1"
              class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
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
            </DatePickerPrev>
            <DatePickerHeading class="text-sm font-semibold text-gray-900" />
            <DatePickerNext
              ref="next"
              tabindex="-1"
              class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-40"
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
            </DatePickerNext>
          </DatePickerHeader>

          <div class="relative flex gap-4">
            <DatePickerGrid v-for="month in grid" :key="month.value.toString()" class="border-collapse">
              <DatePickerGridHead>
                <DatePickerGridRow class="flex">
                  <DatePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-9 pb-1 text-center text-xs font-medium text-gray-400"
                  >
                    {{ day }}
                  </DatePickerHeadCell>
                </DatePickerGridRow>
              </DatePickerGridHead>
              <DatePickerGridBody class="space-y-1">
                <DatePickerGridRow v-for="(week, i) in month.rows" :key="i" class="flex">
                  <DatePickerCell v-for="day in week" :key="day.toString()" :date="day" class="p-0">
                    <DatePickerCellTrigger
                      :day="day"
                      :month="month.value"
                      tabindex="-1"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-outside-view:text-gray-300 data-selected:bg-blue-600 data-selected:text-white data-selected:hover:bg-blue-700 data-today:font-semibold data-today:text-blue-600 data-selected:data-today:text-white"
                    />
                  </DatePickerCell>
                </DatePickerGridRow>
              </DatePickerGridBody>
            </DatePickerGrid>
          </div>
        </DatePickerCalendar>
      </div>
    </DatePickerRoot>
  </div>
</template>
