<script setup lang="ts">
import { CalendarDate, type DateValue, getLocalTimeZone, today } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot
} from 'reka-ui'
import { ref } from 'vue'

import { useDragNav } from '../../composables/useDragNav'

const props = defineProps<{
  modelValue?: Date
  disabled?: boolean
  readonly?: boolean
  locale?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value?: DateValue]
}>()

//
const date = props.modelValue
  ? new CalendarDate(
      props.modelValue.getFullYear(),
      props.modelValue.getMonth() + 1,
      props.modelValue.getDate()
    )
  : today(getLocalTimeZone())
const prev = ref()
const next = ref()

const selected = (value?: DateValue) => {
  emit('update:modelValue', value)
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => prev.value.$el.click(),
  () => next.value.$el.click()
)
</script>

<template>
  <CalendarRoot
    :model-value="date"
    :disabled="disabled"
    :readonly="readonly"
    :locale="locale"
    class="select-none p-3"
    @update:model-value="selected"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @click.capture="onClickCapture"
    @wheel.prevent="onWheel"
  >
    <template #default="{ grid, weekDays }">
      <CalendarHeader class="mb-4 flex items-center justify-between">
        <CalendarPrev
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
        </CalendarPrev>
        <CalendarHeading class="text-sm font-semibold text-gray-900" />
        <CalendarNext
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
        </CalendarNext>
      </CalendarHeader>

      <div class="flex gap-4">
        <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="border-collapse">
          <CalendarGridHead>
            <CalendarGridRow class="flex">
              <CalendarHeadCell
                v-for="day in weekDays"
                :key="day"
                class="w-9 pb-1 text-center text-xs font-medium text-gray-400"
              >
                {{ day }}
              </CalendarHeadCell>
            </CalendarGridRow>
          </CalendarGridHead>
          <CalendarGridBody class="space-y-1">
            <CalendarGridRow v-for="(week, i) in month.rows" :key="i" class="flex">
              <CalendarCell v-for="day in week" :key="day.toString()" :date="day" class="p-0">
                <CalendarCellTrigger
                  :day="day"
                  :month="month.value"
                  class="data-disabled:pointer-events-none data-selected:bg-blue-600 data-today:font-semibold data-outside-view:text-gray-300 data-selected:data-today:text-white data-selected:text-white data-today:text-blue-600 data-disabled:opacity-40 data-selected:hover:bg-blue-700 inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </CalendarCell>
            </CalendarGridRow>
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </template>
  </CalendarRoot>
</template>
