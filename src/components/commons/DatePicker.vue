<script setup lang="ts">
import { type DateValue, getLocalTimeZone } from '@internationalized/date'
import dayjs from 'dayjs'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import type { Locale } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

import Calendar from './Calendar.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    format?: string
    locale?: Locale
  }>(),
  {
    modelValue: '',
    placeholder: '',
    format: 'YYYY-MM-DD',
    locale: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const pick = ref<string>(props.modelValue ?? '')
const inputValue = ref<string>(props.modelValue ?? '')
const inputEl = ref<HTMLInputElement>()

watch(
  () => props.modelValue,
  val => {
    pick.value = val ?? ''
    inputValue.value = val ?? ''
  }
)

const { locale: i18n } = useI18n()
const located = computed(() => props.locale ?? i18n.value)

const numericFormat = computed(() => props.format.replace(/[^YMDHms]/g, ''))

function onInput() {
  if (inputEl.value) {
    const digits = inputEl.value.value.replace(/\D/g, '').slice(0, numericFormat.value.length)
    inputEl.value.value = digits
    inputValue.value = digits
  }
}

function onFocus() {
  open.value = true

  onInput()
  inputEl.value?.select()
}

function onBlur() {
  open.value = false

  if (!inputValue.value) {
    pick.value = ''
    emit('update:modelValue', '')
    return
  }

  let parsed = dayjs(inputValue.value, props.format, true)
  if (!parsed.isValid()) {
    const digits = inputValue.value.replace(/\D/g, '')
    parsed = dayjs(digits, numericFormat.value, true)
  }
  if (parsed.isValid()) {
    pick.value = parsed.format(props.format)
    inputValue.value = pick.value
    emit('update:modelValue', pick.value)
  } else {
    inputValue.value = pick.value
  }
}

const selected = (value?: DateValue) => {
  pick.value = value ? dayjs(value.toDate(getLocalTimeZone())).format(props.format) : ''
  inputValue.value = pick.value
  emit('update:modelValue', pick.value)
  open.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <div
      class="h-control-md inline-flex min-w-40 items-center rounded-md border border-gray-300 bg-white text-sm focus-within:ring-2 focus-within:ring-blue-500"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
      <PopoverTrigger as-child>
        <button
          type="button"
          :disabled="disabled"
          class="flex shrink-0 items-center px-2 text-gray-400 hover:text-gray-600 focus:outline-none disabled:cursor-not-allowed"
          tabindex="-1"
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
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </button>
      </PopoverTrigger>
      <input
        ref="inputEl"
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full bg-transparent pr-3 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.enter.prevent="onBlur"
        @input="onInput"
      />
    </div>
    <PopoverPortal>
      <PopoverContent
        :side-offset="4"
        class="z-50 rounded-md border border-gray-200 bg-white shadow-lg"
        @open-auto-focus.prevent
        @focus-outside.prevent
      >
        <Calendar
          :model-value="pick ? dayjs(pick, format).toDate() : undefined"
          :locale="located"
          @update:model-value="selected"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
