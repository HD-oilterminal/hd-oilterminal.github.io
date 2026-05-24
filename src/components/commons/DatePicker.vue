<script setup lang="ts">
import { type DateValue, getLocalTimeZone } from '@internationalized/date'
import dayjs from 'dayjs'
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import type { Locale } from 'vue-i18n'

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
const pick = ref<string>(props.modelValue)

const { locale: i18n } = useI18n()
const located = computed(() => props.locale ?? i18n.value)

const selected = (value?: DateValue) => {
  pick.value = value ? dayjs(value.toDate(getLocalTimeZone())).format(props.format) : ''

  emit('update:modelValue', pick.value)
  open.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :disabled="disabled"
        class="h-control-md inline-flex min-w-40 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          class="shrink-0 text-gray-400"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
        <span :class="pick ? 'text-gray-900' : 'text-gray-400'">{{ pick || placeholder }}</span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="4"
        class="z-50 rounded-md border border-gray-200 bg-white shadow-lg"
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
