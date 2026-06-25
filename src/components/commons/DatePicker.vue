<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import {
  DatePickerCalendar,
  DatePickerCell,
  DatePickerCellTrigger,
  DatePickerGrid,
  DatePickerGridBody,
  DatePickerGridHead,
  DatePickerGridRow,
  DatePickerHeadCell,
  DatePickerHeader,
  DatePickerHeading,
  DatePickerNext,
  DatePickerPrev,
  DatePickerRoot
} from 'reka-ui'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDragNav } from '../../composables/useDragNav'
import { dateString, toDate } from '../../composables/useFormat'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
  }>(),
  { modelValue: '' }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const { locale } = useI18n()

function parseDate(val: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return { y: val.slice(0, 4), m: val.slice(5, 7), d: val.slice(8, 10) }
  return { y: '', m: '', d: '' }
}

const yearStr = ref('')
const monthStr = ref('')
const dayStr = ref('')
const internalValue = ref<DateValue | undefined>(toDate(props.modelValue))
const placeholder = ref<DateValue | undefined>(toDate(props.modelValue))
const isOpen = ref(false)
const yearInput = ref<HTMLInputElement>()
const monthInput = ref<HTMLInputElement>()
const dayInput = ref<HTMLInputElement>()
const prev = ref()
const next = ref()

const { y: iy, m: im, d: id } = parseDate(props.modelValue)
yearStr.value = iy
monthStr.value = im
dayStr.value = id

// 현재 입력된 연·월 기준 마지막 일(日). 연/월 미완성이면 31
const maxDay = () => {
  const y = parseInt(yearStr.value)
  const m = parseInt(monthStr.value)
  if (yearStr.value.length === 4 && m >= 1 && m <= 12) return new Date(y, m, 0).getDate()
  return 31
}

const tryEmit = () => {
  const m = monthStr.value.padStart(2, '0')
  const d = dayStr.value.padStart(2, '0')
  // 연도 4자리가 입력되면 완성 전이라도 해당 연·월로 달력을 이동
  if (yearStr.value.length === 4) {
    const yNum = parseInt(yearStr.value)
    const mNum = Math.min(Math.max(parseInt(monthStr.value) || 1, 1), 12)
    placeholder.value = new CalendarDate(yNum, mNum, 1)
  }
  if (yearStr.value.length === 4 && monthStr.value && dayStr.value) {
    const dateVal = toDate(`${yearStr.value}-${m}-${d}`)
    internalValue.value = dateVal
    emit('update:modelValue', dateVal ? dateString(dateVal) : '')
  } else {
    internalValue.value = undefined
    emit('update:modelValue', '')
  }
}

const onUpdate = (value: DateValue | undefined) => {
  if (!value) {
    isOpen.value = false
    return
  }
  const cv = value as CalendarDate
  yearStr.value = String(cv.year).padStart(4, '0')
  monthStr.value = String(cv.month).padStart(2, '0')
  dayStr.value = String(cv.day).padStart(2, '0')
  if (yearInput.value) yearInput.value.value = yearStr.value
  if (monthInput.value) monthInput.value.value = monthStr.value
  if (dayInput.value) dayInput.value.value = dayStr.value
  internalValue.value = value
  placeholder.value = value
  emit('update:modelValue', dateString(value))
  isOpen.value = false
}

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  setTimeout(() => {
    if (wrapper.contains(document.activeElement)) return
    if (monthStr.value.length === 1) {
      monthStr.value = monthStr.value.padStart(2, '0')
      if (monthInput.value) monthInput.value.value = monthStr.value
    }
    if (dayStr.value.length === 1) {
      dayStr.value = dayStr.value.padStart(2, '0')
      if (dayInput.value) dayInput.value.value = dayStr.value
    }
    const m = monthStr.value.padStart(2, '0')
    const d = dayStr.value.padStart(2, '0')
    const valid = yearStr.value.length === 4 && monthStr.value && dayStr.value && !!toDate(`${yearStr.value}-${m}-${d}`)
    if (valid) {
      tryEmit()
    } else {
      // 빈값이거나 형식/날짜가 유효하지 않으면 모두 비우고 달력은 오늘 기준으로 복귀
      yearStr.value = ''
      monthStr.value = ''
      dayStr.value = ''
      if (yearInput.value) yearInput.value.value = ''
      if (monthInput.value) monthInput.value.value = ''
      if (dayInput.value) dayInput.value.value = ''
      internalValue.value = undefined
      placeholder.value = undefined
      emit('update:modelValue', '')
    }
    isOpen.value = false
  }, 0)
}

onMounted(() => {
  const year = yearInput.value!
  const month = monthInput.value!
  const day = dayInput.value!

  year.value = yearStr.value
  month.value = monthStr.value
  day.value = dayStr.value

  year.addEventListener('focus', () => year.select())
  month.addEventListener('focus', () => month.select())
  day.addEventListener('focus', () => day.select())

  // oninput: 숫자 이외 문자(한글 포함) 즉시 제거
  year.addEventListener('input', () => {
    const clean = year.value.replace(/[^0-9]/g, '').slice(0, 4)
    year.value = clean
    yearStr.value = clean
    if (clean.length === 4) month.focus()
    tryEmit()
  })

  month.addEventListener('input', () => {
    let clean = month.value.replace(/[^0-9]/g, '').slice(0, 2)
    // 첫 자리 > 1이면 유효한 두 자리 월이 불가 → '0' 패딩 후 자동이동
    if (clean.length === 1 && parseInt(clean) > 1) clean = '0' + clean
    if (clean.length === 2) {
      const n = parseInt(clean)
      if (n < 1) clean = '01'
      else if (n > 12) clean = '12'
    }
    month.value = clean
    monthStr.value = clean
    // 월이 바뀌어 기존 일(日)이 해당 월의 마지막 일을 넘으면 보정
    if (dayStr.value && parseInt(dayStr.value) > maxDay()) {
      dayStr.value = String(maxDay())
      day.value = dayStr.value
    }
    if (clean.length === 2) day.focus()
    tryEmit()
  })

  day.addEventListener('input', () => {
    let clean = day.value.replace(/[^0-9]/g, '').slice(0, 2)
    const max = maxDay()
    // 첫 자리 > 3이면 유효한 두 자리 일이 불가 → '0' 패딩
    if (clean.length === 1 && parseInt(clean) > 3) clean = '0' + clean
    if (clean.length === 2) {
      const n = parseInt(clean)
      if (n < 1) clean = '01'
      else if (n > max) clean = String(max)
    }
    day.value = clean
    dayStr.value = clean
    tryEmit()
  })

  // Backspace/Delete: 세그먼트 전체 삭제 후 이전 세그먼트로 이동
  year.addEventListener('keydown', e => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (yearStr.value) {
        e.preventDefault()
        yearStr.value = ''
        year.value = ''
        tryEmit()
      }
    }
  })

  month.addEventListener('keydown', e => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      monthStr.value = ''
      month.value = ''
      tryEmit()
      year.focus()
    }
  })

  day.addEventListener('keydown', e => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      dayStr.value = ''
      day.value = ''
      tryEmit()
      month.focus()
    }
  })
})

watch(
  () => props.modelValue,
  val => {
    const dateVal = toDate(val)
    // 우리가 방금 emit 한 값이 v-model 로 되돌아온 경우엔 입력 중인 세그먼트를 덮어쓰지 않음
    if (dateVal?.toString() === internalValue.value?.toString()) return
    const { y, m, d } = parseDate(val)
    yearStr.value = y
    monthStr.value = m
    dayStr.value = d
    if (yearInput.value) yearInput.value.value = y
    if (monthInput.value) monthInput.value.value = m
    if (dayInput.value) dayInput.value.value = d
    internalValue.value = dateVal
    if (dateVal) placeholder.value = dateVal
  }
)

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => prev.value?.$el.click(),
  () => next.value?.$el.click()
)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    isOpen.value = false
    return
  }
  // 방향키로 연/월/일 입력 세그먼트 간 이동
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const segments = [yearInput.value, monthInput.value, dayInput.value]
    const idx = segments.indexOf(e.target as HTMLInputElement)
    if (idx === -1) return
    e.preventDefault()
    const next = e.key === 'ArrowLeft' ? idx - 1 : idx + 1
    segments[next]?.focus()
  }
}
</script>

<template>
  <div class="relative inline-block" @focusout="onFocusOut" @keydown="onKeydown">
    <DatePickerRoot
      v-model:placeholder="placeholder as DateValue"
      :model-value="internalValue as DateValue"
      :disabled="disabled"
      :locale="locale"
      granularity="hour"
      @update:model-value="onUpdate"
    >
      <div
        class="h-control-md inline-flex items-center rounded-md border border-gray-300 px-2 text-sm focus-within:ring-2 focus-within:ring-blue-500"
        :class="disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-50' : ''"
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
        <input
          ref="yearInput"
          type="text"
          inputmode="numeric"
          :disabled="disabled"
          class="w-11 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed"
          @focusin="isOpen = true"
        />
        <span class="mx-[-2px] text-gray-500 select-none">-</span>
        <input
          ref="monthInput"
          type="text"
          inputmode="numeric"
          :disabled="disabled"
          class="w-7 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed"
          @focusin="isOpen = true"
        />
        <span class="mx-[-2px] text-gray-500 select-none">-</span>
        <input
          ref="dayInput"
          type="text"
          inputmode="numeric"
          :disabled="disabled"
          class="w-7 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed"
          @focusin="isOpen = true"
        />
      </div>

      <div v-if="isOpen" class="absolute top-full left-0 z-50 mt-1 rounded-md border border-gray-200 bg-white shadow-lg">
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

          <div class="relative z-1000 flex gap-4">
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
