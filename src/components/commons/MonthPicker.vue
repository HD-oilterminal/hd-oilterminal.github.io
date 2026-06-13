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

const internalValue = ref<DateValue | undefined>(toDate(props.modelValue, 'YYYY-MM'))
const viewYear = ref(internalValue.value?.year ?? new Date().getFullYear())
const isOpen = ref(false)
const yearInput = ref()
const monthInput = ref()

const onUpdate = (value: DateValue | undefined) => {
  internalValue.value = value as CalendarDate | undefined
  emit('update:modelValue', value ? dateString(value, 'YYYY-MM') : '')
}

const selectMonth = (month: number) => {
  const val = new CalendarDate(viewYear.value, month, 1)
  internalValue.value = val
  emit('update:modelValue', dateString(val, 'YYYY-MM'))
  isOpen.value = false
}

const monthNames = computed(() =>
  Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(locale.value, { month: 'short' }).format(new Date(2000, i, 1)))
)

const onBackspace = (e: KeyboardEvent) => {
  if (e.key !== 'Backspace') return
  const focused = document.activeElement
  if (focused === monthInput.value?.$el && monthInput.value.$el.textContent?.trim() === '__') {
    e.preventDefault()
    yearInput.value.$el.focus()
  }
}

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  if (!e.relatedTarget || !wrapper.contains(e.relatedTarget as Node)) {
    const yearPh = yearInput.value?.$el?.textContent?.trim() === '____'
    const monthPh = monthInput.value?.$el?.textContent?.trim() === '__'
    const allEmpty = yearPh && monthPh
    const allFilled = !yearPh && !monthPh

    if (!allEmpty && !allFilled) {
      // 부분 입력 → 초기화
      internalValue.value = undefined
      emit('update:modelValue', '')
    } else if (allFilled && !internalValue.value) {
      // 빈 상태에서 키보드로 연·월 모두 입력 완료 (reka-ui는 day 미입력으로 이벤트 미발생)
      const year = Number(yearInput.value.$el.textContent?.trim())
      const month = Number(monthInput.value.$el.textContent?.trim())
      if (year > 0 && month >= 1 && month <= 12) {
        const val = new CalendarDate(year, month, 1)
        internalValue.value = val
        emit('update:modelValue', dateString(val, 'YYYY-MM'))
      } else {
        internalValue.value = undefined
        emit('update:modelValue', '')
      }
    }

    isOpen.value = false
  }
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => viewYear.value--,
  () => viewYear.value++
)

//
watch(
  () => props.modelValue,
  val => {
    const next = toDate(val, 'YYYY-MM')
    if (next?.toString() !== internalValue.value?.toString()) {
      internalValue.value = next
      if (next) viewYear.value = next.year
    }
  }
)

watch(internalValue, val => {
  if (val) viewYear.value = val.year
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
        class="h-control-md inline-flex min-w-24 items-center rounded-md border border-gray-300 bg-white pl-1 text-sm focus-within:ring-2 focus-within:ring-blue-500"
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
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-300 data-placeholder:text-gray-400"
        >
          {{ pad(segments.find(s => s.part === 'year')?.value, '____') }}
        </DatePickerInput>
        <span class="mx-[-2px] text-gray-500 select-none">-</span>
        <DatePickerInput
          ref="monthInput"
          part="month"
          class="rounded px-1 tabular-nums caret-transparent outline-none focus:bg-gray-300 data-placeholder:text-gray-400"
        >
          {{ pad(segments.find(s => s.part === 'month')?.value, '__', 2) }}
        </DatePickerInput>
      </DatePickerField>

      <div
        v-if="isOpen"
        class="absolute top-full left-0 z-50 w-56 rounded-md border border-gray-200 bg-white p-3 shadow-lg select-none"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
        @click.capture="onClickCapture"
        @wheel.prevent="onWheel"
      >
        <div class="mb-3 flex items-center justify-between">
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
            @mousedown.prevent
            @click="viewYear--"
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
          <span class="text-sm font-semibold text-gray-900">{{ viewYear }}</span>
          <button
            type="button"
            tabindex="-1"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
            @mousedown.prevent
            @click="viewYear++"
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
            v-for="(name, i) in monthNames"
            :key="i"
            type="button"
            tabindex="-1"
            :class="[
              'rounded px-1 py-1.5 text-sm transition-colors',
              internalValue?.year === viewYear && internalValue?.month === i + 1
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'hover:bg-gray-100'
            ]"
            @mousedown.prevent
            @click="selectMonth(i + 1)"
          >
            {{ name }}
          </button>
        </div>
      </div>
    </DatePickerRoot>
  </div>
</template>
