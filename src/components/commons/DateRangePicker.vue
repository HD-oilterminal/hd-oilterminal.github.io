<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import {
  DateRangePickerCalendar,
  DateRangePickerCell,
  DateRangePickerCellTrigger,
  DateRangePickerContent,
  DateRangePickerField,
  DateRangePickerGrid,
  DateRangePickerGridBody,
  DateRangePickerGridHead,
  DateRangePickerGridRow,
  DateRangePickerHeadCell,
  DateRangePickerHeader,
  DateRangePickerHeading,
  DateRangePickerInput,
  DateRangePickerNext,
  DateRangePickerPrev,
  DateRangePickerRoot,
  DateRangePickerTrigger
} from 'reka-ui'
import { computed, ref, watch } from 'vue'
import type { Locale } from 'vue-i18n'
import { useI18n } from 'vue-i18n'

import { useFormat } from '../../composables/useFormat'

const props = withDefaults(
  defineProps<{
    modelValue?: { start?: string; end?: string }
    placeholder?: string
    disabled?: boolean
    format?: string
    locale?: Locale
  }>(),
  {
    modelValue: () => ({ start: '', end: '' }),
    placeholder: '',
    format: 'YYYY-MM-DD',
    locale: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: { start?: string; end?: string }]
}>()

const { locale: i18n } = useI18n()
const located = computed(() => props.locale ?? i18n.value)

const { dateString, toDate } = useFormat()

const localModelValue = ref<DateRange>({
  start: toDate(props.modelValue?.start),
  end: toDate(props.modelValue?.end)
})

watch(
  () => props.modelValue,
  val => {
    localModelValue.value = {
      start: toDate(val?.start),
      end: toDate(val?.end)
    }
  }
)

const selected = (value: DateRange) => {
  localModelValue.value = value

  emit('update:modelValue', {
    start: dateString(value.start, props.format),
    end: dateString(value.end, props.format)
  })
}
</script>

<template>
  <DateRangePickerRoot
    :model-value="localModelValue as DateRange"
    :locale="located"
    :close-on-select="true"
    :disabled="disabled"
    @update:model-value="selected"
  >
    <DateRangePickerTrigger
      class="focus:ring-primary-500 ml-auto shrink-0 rounded p-0.5 text-gray-400 hover:text-gray-600 focus:ring-2 focus:outline-none"
    >
      <DateRangePickerField
        v-slot="{ segments }"
        class="h-control-md focus-within:ring-primary-500 inline-flex min-w-60 items-center rounded-md border border-gray-300 bg-white px-3 text-sm select-none focus-within:ring-2 focus-within:outline-none hover:bg-gray-50 data-invalid:border-red-500"
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
          class="mr-2"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>

        <template v-for="item in segments.start" :key="item.part">
          <DateRangePickerInput v-if="item.part === 'literal'" :part="item.part" type="start">
            {{ item.value }}
          </DateRangePickerInput>
          <DateRangePickerInput
            v-else
            :part="item.part"
            class="focus:bg-primary-100 rounded p-0.5 focus:outline-none data-placeholder:text-gray-400"
            type="start"
          >
            {{ item.value }}
          </DateRangePickerInput>
        </template>
        <span class="mx-1 text-gray-400">~</span>
        <template v-for="item in segments.end" :key="item.part">
          <DateRangePickerInput v-if="item.part === 'literal'" :part="item.part" type="end">
            {{ item.value }}
          </DateRangePickerInput>
          <DateRangePickerInput
            v-else
            :part="item.part"
            class="focus:bg-primary-100 rounded p-0.5 focus:outline-none data-placeholder:text-gray-400"
            type="end"
          >
            {{ item.value }}
          </DateRangePickerInput>
        </template>
      </DateRangePickerField>
    </DateRangePickerTrigger>

    <DateRangePickerContent
      :side-offset="4"
      class="z-50 rounded-md border border-gray-200 bg-white shadow-lg"
    >
      <DateRangePickerCalendar v-slot="{ weekDays, grid }" class="p-3 select-none">
        <DateRangePickerHeader class="mb-4 flex items-center justify-between">
          <DateRangePickerPrev
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
          <DateRangePickerHeading class="text-sm font-semibold text-gray-900" />
          <DateRangePickerNext
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

        <div class="flex gap-6">
          <DateRangePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="border-collapse"
          >
            <DateRangePickerGridHead>
              <DateRangePickerGridRow class="flex">
                <DateRangePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-9 pb-1 text-center text-xs font-medium text-gray-400"
                >
                  {{ day }}
                </DateRangePickerHeadCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridHead>
            <DateRangePickerGridBody class="space-y-1">
              <DateRangePickerGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="flex"
              >
                <DateRangePickerCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="relative p-0"
                >
                  <DateRangePickerCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="data-highlighted:bg-primary-100 data-selected:bg-primary-100 data-selection-end:bg-primary-600! data-selection-start:bg-primary-600! data-today:text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:rounded-none data-outside-view:text-gray-300 data-selected:rounded-none data-selection-end:rounded-r-md data-selection-end:text-white data-selection-start:rounded-l-md data-selection-start:text-white data-today:font-semibold"
                  />
                </DateRangePickerCell>
              </DateRangePickerGridRow>
            </DateRangePickerGridBody>
          </DateRangePickerGrid>
        </div>
      </DateRangePickerCalendar>
    </DateRangePickerContent>
  </DateRangePickerRoot>
</template>
