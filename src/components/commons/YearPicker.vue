<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { computed, onMounted, ref, watch } from 'vue'

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

function parseYear(val: string) {
  return /^\d{4}$/.test(val) ? val : ''
}

const yearStr = ref('')
const internalValue = ref<DateValue | undefined>(toDate(props.modelValue, 'YYYY'))
const currentYear = new Date().getFullYear()
const viewPageStart = ref(Math.floor((internalValue.value?.year ?? currentYear) / 12) * 12)
const isOpen = ref(false)
const yearInput = ref<HTMLInputElement>()

yearStr.value = parseYear(props.modelValue)

const tryEmit = () => {
  if (yearStr.value.length === 4) {
    const yNum = parseInt(yearStr.value)
    viewPageStart.value = Math.floor(yNum / 12) * 12
    const val = new CalendarDate(yNum, 1, 1)
    internalValue.value = val
    emit('update:modelValue', dateString(val, 'YYYY'))
  } else {
    internalValue.value = undefined
    emit('update:modelValue', '')
  }
}

const selectYear = (year: number) => {
  yearStr.value = String(year).padStart(4, '0')
  if (yearInput.value) yearInput.value.value = yearStr.value
  const val = new CalendarDate(year, 1, 1)
  internalValue.value = val
  emit('update:modelValue', dateString(val, 'YYYY'))
  isOpen.value = false
}

const onFocusOut = (e: FocusEvent) => {
  const wrapper = e.currentTarget as HTMLElement
  setTimeout(() => {
    if (wrapper.contains(document.activeElement)) return
    if (yearStr.value.length === 4) {
      tryEmit()
    } else {
      yearStr.value = ''
      if (yearInput.value) yearInput.value.value = ''
      internalValue.value = undefined
      emit('update:modelValue', '')
    }
    isOpen.value = false
  }, 0)
}

onMounted(() => {
  const year = yearInput.value!
  year.value = yearStr.value

  year.addEventListener('focus', () => year.select())

  // oninput: 숫자 이외 문자(한글 포함) 즉시 제거
  year.addEventListener('input', () => {
    const clean = year.value.replace(/[^0-9]/g, '').slice(0, 4)
    year.value = clean
    yearStr.value = clean
    tryEmit()
  })

  // Backspace/Delete: 세그먼트 전체 삭제
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
})

watch(
  () => props.modelValue,
  val => {
    const dateVal = toDate(val, 'YYYY')
    // 우리가 방금 emit 한 값이 v-model 로 되돌아온 경우엔 입력 중인 세그먼트를 덮어쓰지 않음
    if (dateVal?.toString() === internalValue.value?.toString()) return
    yearStr.value = parseYear(val)
    if (yearInput.value) yearInput.value.value = yearStr.value
    internalValue.value = dateVal
    if (dateVal) viewPageStart.value = Math.floor(dateVal.year / 12) * 12
  }
)

const { onPointerDown, onPointerUp, onPointerCancel, onClickCapture, onWheel } = useDragNav(
  () => (viewPageStart.value -= 12),
  () => (viewPageStart.value += 12)
)

const years = computed(() => Array.from({ length: 12 }, (_, i) => viewPageStart.value + i))

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Enter') isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block" @focusout="onFocusOut" @keydown="onKeydown">
    <div
      class="h-control-md inline-flex items-center rounded-md border border-gray-300 px-2 focus-within:ring-2 focus-within:ring-blue-500"
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
    </div>

    <div
      v-if="isOpen"
      class="absolute top-full left-0 z-50 mt-1 w-52 rounded-md border border-gray-200 bg-white p-3 shadow-lg select-none"
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
        <span class="font-semibold text-gray-900">{{ viewPageStart }} – {{ viewPageStart + 11 }}</span>
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
            'rounded px-1 py-1.5 transition-colors',
            internalValue?.year === year ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-gray-100'
          ]"
          @mousedown.prevent
          @click="selectYear(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>
  </div>
</template>
