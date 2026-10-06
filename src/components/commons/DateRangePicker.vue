<script setup lang="ts">
import { CalendarDate, type DateValue, endOfMonth, getLocalTimeZone, startOfMonth, today } from '@internationalized/date'
import {
  type DateRange,
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot
} from 'reka-ui'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useDragNav } from '../../composables/useDragNav'
import { dateString, toDate } from '../../composables/useFormat'

const props = withDefaults(
  defineProps<{
    start?: string
    end?: string
    disabled?: boolean
  }>(),
  { start: '', end: '' }
)

const emit = defineEmits<{ 'update:start': [value: string]; 'update:end': [value: string] }>()

const { locale } = useI18n()

const emitValue = (key: 'start' | 'end', value: string) =>
  key === 'start' ? emit('update:start', value) : emit('update:end', value)

function parseDate(val: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return { y: val.slice(0, 4), m: val.slice(5, 7), d: val.slice(8, 10) }
  return { y: '', m: '', d: '' }
}

const internalValue = shallowRef<DateRange>({ start: toDate(props.start), end: toDate(props.end) })
const placeholder = ref<DateValue | undefined>(toDate(props.start) ?? toDate(props.end))
const isOpen = ref(false)
const prev = ref()
const next = ref()

// 연·월·일 세그먼트 입력 한 묶음(시작/종료 각각 하나씩). DatePicker.vue 의 입력 로직과 동일
function useSegments(key: 'start' | 'end', initial: string) {
  const yearStr = ref('')
  const monthStr = ref('')
  const dayStr = ref('')
  const yearInput = ref<HTMLInputElement>()
  const monthInput = ref<HTMLInputElement>()
  const dayInput = ref<HTMLInputElement>()

  const { y, m, d } = parseDate(initial)
  yearStr.value = y
  monthStr.value = m
  dayStr.value = d

  // 현재 입력된 연·월 기준 마지막 일(日). 연/월 미완성이면 31
  const maxDay = () => {
    const yNum = parseInt(yearStr.value)
    const mNum = parseInt(monthStr.value)
    if (yearStr.value.length === 4 && mNum >= 1 && mNum <= 12) return new Date(yNum, mNum, 0).getDate()
    return 31
  }

  const set = (yy: string, mm: string, dd: string) => {
    yearStr.value = yy
    monthStr.value = mm
    dayStr.value = dd
    if (yearInput.value) yearInput.value.value = yy
    if (monthInput.value) monthInput.value.value = mm
    if (dayInput.value) dayInput.value.value = dd
  }

  const setDate = (value?: DateValue) => {
    if (!value) return set('', '', '')
    const cv = value as CalendarDate
    set(String(cv.year).padStart(4, '0'), String(cv.month).padStart(2, '0'), String(cv.day).padStart(2, '0'))
  }

  const complete = () => yearStr.value.length === 4 && !!monthStr.value && !!dayStr.value

  const value = () =>
    complete() ? toDate(`${yearStr.value}-${monthStr.value.padStart(2, '0')}-${dayStr.value.padStart(2, '0')}`) : undefined

  const tryEmit = () => {
    // 연도 4자리가 입력되면 완성 전이라도 해당 연·월로 달력을 이동
    if (yearStr.value.length === 4) {
      const yNum = parseInt(yearStr.value)
      const mNum = Math.min(Math.max(parseInt(monthStr.value) || 1, 1), 12)
      placeholder.value = new CalendarDate(yNum, mNum, 1)
    }
    const dateVal = value()
    internalValue.value = { ...internalValue.value, [key]: dateVal }
    emitValue(key, dateVal ? dateString(dateVal) : '')
  }

  // 포커스 이탈 시: 한 자리 월/일 패딩, 유효하지 않으면 비움
  const settle = () => {
    if (monthStr.value.length === 1) set(yearStr.value, monthStr.value.padStart(2, '0'), dayStr.value)
    if (dayStr.value.length === 1) set(yearStr.value, monthStr.value, dayStr.value.padStart(2, '0'))
    if (complete() && value()) {
      tryEmit()
      return true
    }
    set('', '', '')
    internalValue.value = { ...internalValue.value, [key]: undefined }
    emitValue(key, '')
    return false
  }

  const bind = () => {
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
      if (e.key === 'Delete') clear(e)
      else if (e.key === 'Backspace') {
        if (yearStr.value) {
          e.preventDefault()
          yearStr.value = ''
          year.value = ''
          tryEmit()
        }
      }
    })

    month.addEventListener('keydown', e => {
      if (e.key === 'Delete') clear(e)
      else if (e.key === 'Backspace') {
        e.preventDefault()
        monthStr.value = ''
        month.value = ''
        tryEmit()
        year.focus()
      }
    })

    day.addEventListener('keydown', e => {
      if (e.key === 'Delete') clear(e)
      else if (e.key === 'Backspace') {
        e.preventDefault()
        dayStr.value = ''
        day.value = ''
        tryEmit()
        month.focus()
      }
    })
  }

  const clear = (e: KeyboardEvent) => {
    e.preventDefault()
    set('', '', '')
    yearInput.value?.focus()
  }

  return { yearInput, monthInput, dayInput, set, setDate, value, settle, bind }
}

const startSeg = useSegments('start', props.start)
const endSeg = useSegments('end', props.end)

const sameDay = (a?: DateValue, b?: DateValue) => (!a && !b) || (!!a && !!b && a.compare(b) === 0)

// 달력에 전달하는 값. reka 는 종료만 있는 범위를 시작만 있는 것으로 정규화해 되돌리므로, 시작이 없으면 빈 범위로 전달
const calendarValue = computed<DateRange>(() =>
  internalValue.value.start ? internalValue.value : { start: undefined, end: undefined }
)

const onUpdate = (value: DateRange) => {
  let s = value?.start
  let e = value?.end
  // 우리가 전달한 값이 그대로 되돌아온 echo 는 무시
  if (sameDay(s, calendarValue.value.start) && sameDay(e, calendarValue.value.end)) return
  // 종료만 입력된 상태에서 달력 클릭 → 클릭한 날을 시작으로 범위 완성
  const cur = internalValue.value
  if (s && !e && !cur.start && cur.end) {
    e = cur.end
    if (s.compare(e) > 0) [s, e] = [e, s]
  }
  startSeg.setDate(s)
  endSeg.setDate(e)
  internalValue.value = { start: s, end: e }
  emit('update:start', s ? dateString(s) : '')
  emit('update:end', e ? dateString(e) : '')
  // 시작·종료가 모두 선택되면 닫고, 시작만 선택된 상태면 종료 선택을 위해 열어 둠
  if (s && e) isOpen.value = false
}

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  setTimeout(() => {
    if (wrapper.contains(document.activeElement)) return
    const sOk = startSeg.settle()
    const eOk = endSeg.settle()
    // 둘 다 비어 있으면 달력은 오늘 기준으로 복귀
    if (!sOk && !eOk) placeholder.value = undefined
    isOpen.value = false
  }, 0)
}

onMounted(() => {
  startSeg.bind()
  endSeg.bind()
})

const syncFromProps = (key: 'start' | 'end', seg: ReturnType<typeof useSegments>) => (val: string) => {
  const dateVal = toDate(val)
  // 우리가 방금 emit 한 값이 v-model 로 되돌아온 경우엔 입력 중인 세그먼트를 덮어쓰지 않음
  if (dateVal?.toString() === internalValue.value[key]?.toString()) return
  const { y, m, d } = parseDate(val)
  seg.set(y, m, d)
  internalValue.value = { ...internalValue.value, [key]: dateVal }
  if (dateVal) placeholder.value = dateVal
}

watch(() => props.start, syncFromProps('start', startSeg))
watch(() => props.end, syncFromProps('end', endSeg))

// 헤더 연/월 select: placeholder 기준(미입력 시 오늘)으로 표시, 선택 시 해당 월로 이동
const headDate = computed(() => placeholder.value ?? today(getLocalTimeZone()))
const years = computed(() => Array.from({ length: 31 }, (_, i) => headDate.value.year - 15 + i))
const onYearChange = (e: Event) => {
  placeholder.value = new CalendarDate(Number((e.target as HTMLSelectElement).value), headDate.value.month, 1)
}
const onMonthChange = (e: Event) => {
  placeholder.value = new CalendarDate(headDate.value.year, Number((e.target as HTMLSelectElement).value), 1)
}
const goToday = () => {
  placeholder.value = today(getLocalTimeZone())
}

// before(-1): 시작일 기준 전월 1일~말일, after(+1): 종료일 기준 익월 1일~말일. 기준 날짜가 없으면 오늘
const shiftMonth = (delta: -1 | 1) => {
  const base = (delta < 0 ? internalValue.value.start : internalValue.value.end) ?? today(getLocalTimeZone())
  const month = base.add({ months: delta })
  const s = startOfMonth(month)
  const e = endOfMonth(month)
  startSeg.setDate(s)
  endSeg.setDate(e)
  internalValue.value = { start: s, end: e }
  placeholder.value = s
  emit('update:start', dateString(s))
  emit('update:end', dateString(e))
}

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => prev.value?.$el.click(),
  () => next.value?.$el.click()
)

// <label>(Field) 안에 놓이면 셀(div) 클릭이 label 활성화로 이어져 첫 labelable 요소(before 버튼)가 클릭됨 → 차단
const onClick = (e: MouseEvent) => {
  if (!(e.target as HTMLElement).closest('input,button,select')) e.preventDefault()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    isOpen.value = false
    return
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const segments = [
      startSeg.yearInput.value,
      startSeg.monthInput.value,
      startSeg.dayInput.value,
      endSeg.yearInput.value,
      endSeg.monthInput.value,
      endSeg.dayInput.value
    ]
    const idx = segments.indexOf(e.target as HTMLInputElement)
    if (idx === -1) return
    e.preventDefault()
    const next = e.key === 'ArrowLeft' ? idx - 1 : idx + 1
    segments[next]?.focus()
  }
}
</script>

<template>
  <div class="relative inline-block" @click="onClick" @focusout="onFocusOut" @keydown="onKeydown">
    <DateRangePickerRoot
      v-model:placeholder="placeholder as DateValue"
      :model-value="calendarValue"
      :disabled="disabled"
      :locale="locale"
      :number-of-months="2"
      @update:model-value="onUpdate"
    >
      <div class="inline-flex items-center gap-1">
        <button
          type="button"
          tabindex="-1"
          :disabled="disabled"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          @click="shiftMonth(-1)"
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
        <div
          class="h-control-md inline-flex items-center rounded-md border border-gray-300 bg-white px-2 focus-within:ring-2 focus-within:ring-blue-500"
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
            :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <input
            :ref="startSeg.yearInput"
            type="text"
            inputmode="numeric"
            data-type="date"
            :disabled="disabled"
            class="w-11 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @focusin="isOpen = true"
          />
          <span class="-mx-1.5 text-gray-500 select-none">-</span>
          <input
            :ref="startSeg.monthInput"
            type="text"
            inputmode="numeric"
            data-type="date"
            :disabled="disabled"
            class="w-7 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @focusin="isOpen = true"
          />
          <span class="-mx-1.5 text-gray-500 select-none">-</span>
          <input
            :ref="startSeg.dayInput"
            type="text"
            inputmode="numeric"
            data-type="date"
            :disabled="disabled"
            class="w-7 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @focusin="isOpen = true"
          />
          <span class="px-1 text-gray-500 select-none">~</span>
          <input
            :ref="endSeg.yearInput"
            type="text"
            inputmode="numeric"
            data-type="date"
            :disabled="disabled"
            class="w-11 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @focusin="isOpen = true"
          />
          <span class="-mx-1.5 text-gray-500 select-none">-</span>
          <input
            :ref="endSeg.monthInput"
            type="text"
            inputmode="numeric"
            data-type="date"
            :disabled="disabled"
            class="w-7 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @focusin="isOpen = true"
          />
          <span class="-mx-1.5 text-gray-500 select-none">-</span>
          <input
            :ref="endSeg.dayInput"
            type="text"
            inputmode="numeric"
            data-type="date"
            :disabled="disabled"
            class="w-7 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed disabled:opacity-40"
            @focusin="isOpen = true"
          />
        </div>
        <button
          type="button"
          tabindex="-1"
          :disabled="disabled"
          class="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          @click="shiftMonth(1)"
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

      <div v-if="isOpen" class="absolute top-full left-0 z-50 rounded-md border border-gray-200 bg-white shadow-lg">
        <DateRangePickerCalendar
          v-slot="{ grid, weekDays }"
          class="p-1 select-none"
          @pointerdown="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerCancel"
          @click.capture="onClickCapture"
          @wheel.prevent="onWheel"
        >
          <DateRangePickerHeader class="mb-1 flex items-center justify-between">
            <DateRangePickerPrev
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
            </DateRangePickerPrev>
            <div class="flex items-center gap-1 font-semibold text-gray-900" @wheel.stop>
              <select
                :value="headDate.year"
                tabindex="-1"
                class="head-select cursor-pointer rounded-md bg-transparent px-1 py-0.5 hover:bg-gray-100 focus:outline-none"
                @change="onYearChange"
              >
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
              <select
                :value="headDate.month"
                tabindex="-1"
                class="head-select cursor-pointer rounded-md bg-transparent px-1 py-0.5 hover:bg-gray-100 focus:outline-none"
                @change="onMonthChange"
              >
                <option v-for="m in 12" :key="m" :value="m">{{ String(m).padStart(2, '0') }}</option>
              </select>
            </div>
            <DateRangePickerNext
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
            </DateRangePickerNext>
          </DateRangePickerHeader>

          <div class="relative z-1000 flex gap-3">
            <DateRangePickerGrid v-for="month in grid" :key="month.value.toString()">
              <DateRangePickerGridHead>
                <DateRangePickerGridRow class="flex">
                  <DateRangePickerHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-7 text-center text-sm font-medium text-gray-400"
                  >
                    {{ day }}
                  </DateRangePickerHeadCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridHead>
              <DateRangePickerGridBody class="space-y-1">
                <DateRangePickerGridRow v-for="(week, i) in month.rows" :key="i" class="flex">
                  <DateRangePickerCell v-for="day in week" :key="day.toString()" :date="day" class="p-0">
                    <DateRangePickerCellTrigger
                      :day="day"
                      :month="month.value"
                      tabindex="-1"
                      class="inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:rounded-none data-highlighted:bg-blue-100 data-outside-view:bg-transparent! data-outside-view:text-gray-300! data-selected:rounded-none data-selected:bg-blue-100 data-selection-end:rounded-r-md data-selection-end:bg-blue-600 data-selection-end:text-white data-selection-start:rounded-l-md data-selection-start:bg-blue-600 data-selection-start:text-white data-today:font-semibold data-today:text-blue-600 data-selection-end:data-today:text-white data-selection-start:data-today:text-white"
                    />
                  </DateRangePickerCell>
                </DateRangePickerGridRow>
              </DateRangePickerGridBody>
            </DateRangePickerGrid>
          </div>

          <div class="flex justify-center border-t border-gray-100">
            <button
              type="button"
              tabindex="-1"
              class="rounded-md px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
              @click="goToday"
            >
              Today
            </button>
          </div>
        </DateRangePickerCalendar>
      </div>
    </DateRangePickerRoot>
  </div>
</template>

<style scoped>
.head-select {
  appearance: none;
  padding-right: 1.25rem;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>");
  background-repeat: no-repeat;
  background-position: right 2px center;
  background-size: 14px;
}
</style>
