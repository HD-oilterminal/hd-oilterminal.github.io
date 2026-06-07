<script setup lang="ts">
import {
  type DateRange,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot
} from 'reka-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDragNav } from '../../composables/useDragNav'

withDefaults(
  defineProps<{
    modelValue: DateRange
    disabled?: boolean
    readonly?: boolean
    numberOfMonths?: number
    locale?: string
  }>(),
  {
    numberOfMonths: 2,
    locale: 'ko'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: DateRange]
}>()

const { locale: defaultLocale } = useI18n()

//
const prev = ref()
const next = ref()

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => prev.value.$el.click(),
  () => next.value.$el.click()
)

const selected = (value: DateRange) => {
  if (!value.start || !value.end) return

  let start = value.start
  let end = value.end

  console.log(
    'value.start.compare(value.end)',
    value.start,
    value.end,
    value.start.compare(value.end)
  )

  if (value.start && value.end && value.start.compare(value.end) < 0) {
    start = value.end
    end = value.start
  }

  emit('update:modelValue', { start, end })
}
</script>

<template>
  <RangeCalendarRoot
    :model-value="{
      start: modelValue.start ? modelValue.start : undefined,
      end: modelValue.end ? modelValue.end : undefined
    }"
    :disabled="disabled"
    :readonly="readonly"
    :number-of-months="numberOfMonths"
    :locale="locale || defaultLocale"
    class="p-3 select-none"
    @update:model-value="selected"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @click.capture="onClickCapture"
    @wheel.prevent="onWheel"
  >
    <template #default="{ grid, weekDays }">
      <RangeCalendarHeader class="mb-4 flex items-center justify-between">
        <RangeCalendarPrev
          ref="prev"
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
        </RangeCalendarPrev>
        <RangeCalendarHeading class="text-sm font-semibold text-gray-900" />
        <RangeCalendarNext
          ref="next"
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
        </RangeCalendarNext>
      </RangeCalendarHeader>

      <div class="flex gap-6">
        <RangeCalendarGrid
          v-for="month in grid"
          :key="month.value.toString()"
          class="border-collapse"
        >
          <RangeCalendarGridHead>
            <RangeCalendarGridRow class="flex">
              <RangeCalendarHeadCell
                v-for="day in weekDays"
                :key="day"
                class="w-9 pb-1 text-center text-xs font-medium text-gray-400"
              >
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody class="space-y-1">
            <RangeCalendarGridRow v-for="(week, i) in month.rows" :key="i" class="flex">
              <RangeCalendarCell
                v-for="date in week"
                :key="date.toString()"
                :date="date"
                class="relative p-0"
              >
                <RangeCalendarCellTrigger
                  :day="date"
                  :month="month.value"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:rounded-none data-highlighted:bg-blue-100 data-outside-view:text-gray-300 data-selected:rounded-none data-selected:bg-blue-100 data-selection-end:rounded-r-md data-selection-end:bg-blue-600! data-selection-end:text-white data-selection-start:rounded-l-md data-selection-start:bg-blue-600! data-selection-start:text-white data-today:font-semibold data-today:text-blue-600"
                />
              </RangeCalendarCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </div>
    </template>
  </RangeCalendarRoot>
</template>
