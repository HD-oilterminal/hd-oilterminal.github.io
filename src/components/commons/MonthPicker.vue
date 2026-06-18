<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { computed, onMounted, ref, watch } from 'vue'
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

function parseMonth(val: string) {
  if (/^\d{4}-\d{2}$/.test(val)) return { y: val.slice(0, 4), m: val.slice(5, 7) }
  return { y: '', m: '' }
}

const yearStr = ref('')
const monthStr = ref('')
const internalValue = ref<DateValue | undefined>(toDate(props.modelValue, 'YYYY-MM'))
const viewYear = ref(internalValue.value?.year ?? new Date().getFullYear())
const isOpen = ref(false)
const yearInput = ref<HTMLInputElement>()
const monthInput = ref<HTMLInputElement>()

const { y: iy, m: im } = parseMonth(props.modelValue)
yearStr.value = iy
monthStr.value = im

const tryEmit = () => {
  // 연도 4자리가 입력되면 해당 연도로 달력을 이동
  if (yearStr.value.length === 4) viewYear.value = parseInt(yearStr.value)
  if (yearStr.value.length === 4 && monthStr.value) {
    const m = monthStr.value.padStart(2, '0')
    const val = toDate(`${yearStr.value}-${m}-01`)
    internalValue.value = val
    emit('update:modelValue', val ? dateString(val, 'YYYY-MM') : '')
  } else {
    internalValue.value = undefined
    emit('update:modelValue', '')
  }
}

const selectMonth = (month: number) => {
  yearStr.value = String(viewYear.value).padStart(4, '0')
  monthStr.value = String(month).padStart(2, '0')
  if (yearInput.value) yearInput.value.value = yearStr.value
  if (monthInput.value) monthInput.value.value = monthStr.value
  const val = new CalendarDate(viewYear.value, month, 1)
  internalValue.value = val
  emit('update:modelValue', dateString(val, 'YYYY-MM'))
  isOpen.value = false
}

const monthNames = computed(() =>
  Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(locale.value, { month: 'short' }).format(new Date(2000, i, 1)))
)

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  setTimeout(() => {
    if (wrapper.contains(document.activeElement)) return
    if (monthStr.value.length === 1) {
      monthStr.value = monthStr.value.padStart(2, '0')
      if (monthInput.value) monthInput.value.value = monthStr.value
    }
    const m = monthStr.value.padStart(2, '0')
    const valid = yearStr.value.length === 4 && monthStr.value && !!toDate(`${yearStr.value}-${m}-01`)
    if (valid) {
      tryEmit()
    } else {
      // 빈값이거나 형식/값이 유효하지 않으면 모두 비우기
      yearStr.value = ''
      monthStr.value = ''
      if (yearInput.value) yearInput.value.value = ''
      if (monthInput.value) monthInput.value.value = ''
      internalValue.value = undefined
      emit('update:modelValue', '')
    }
    isOpen.value = false
  }, 0)
}

onMounted(() => {
  const year = yearInput.value!
  const month = monthInput.value!

  year.value = yearStr.value
  month.value = monthStr.value

  year.addEventListener('focus', () => year.select())
  month.addEventListener('focus', () => month.select())

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
    // 첫 자리 > 1이면 유효한 두 자리 월이 불가 → '0' 패딩
    if (clean.length === 1 && parseInt(clean) > 1) clean = '0' + clean
    if (clean.length === 2) {
      const n = parseInt(clean)
      if (n < 1) clean = '01'
      else if (n > 12) clean = '12'
    }
    month.value = clean
    monthStr.value = clean
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
})

watch(
  () => props.modelValue,
  val => {
    const dateVal = toDate(val, 'YYYY-MM')
    // 우리가 방금 emit 한 값이 v-model 로 되돌아온 경우엔 입력 중인 세그먼트를 덮어쓰지 않음
    if (dateVal?.toString() === internalValue.value?.toString()) return
    const { y, m } = parseMonth(val)
    yearStr.value = y
    monthStr.value = m
    if (yearInput.value) yearInput.value.value = y
    if (monthInput.value) monthInput.value.value = m
    internalValue.value = dateVal
    if (dateVal) viewYear.value = dateVal.year
  }
)

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => viewYear.value--,
  () => viewYear.value++
)

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    isOpen.value = false
    return
  }
  // 방향키로 연/월 입력 세그먼트 간 이동
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const segments = [yearInput.value, monthInput.value]
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
        class="w-10 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed"
        @focusin="isOpen = true"
      />
      <span class="mx-[-2px] text-gray-500 select-none">-</span>
      <input
        ref="monthInput"
        type="text"
        inputmode="numeric"
        :disabled="disabled"
        class="w-6 rounded px-1 text-center tabular-nums outline-none disabled:cursor-not-allowed"
        @focusin="isOpen = true"
      />
    </div>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border border-gray-200 bg-white p-3 shadow-lg select-none"
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
  </div>
</template>
