<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui'

import IconArrowDown from './IconArrowDown.vue'

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    labelSize?: string
    options?: Option[]
    placeholder?: string
    required?: boolean
    disabled?: boolean
    class?: string
  }>(),
  {
    modelValue: undefined,
    label: '',
    labelSize: '6rem',
    required: false,
    placeholder: '',
    options: () => [],
    class: ''
  }
)

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const EMPTY_VALUE = '__EMPTY__'
const toInternal = (v: string) => (v === '' ? EMPTY_VALUE : v)
const toExternal = (v: string) => (v === EMPTY_VALUE ? '' : v)
</script>

<template>
  <label
    class="field field-select relative shrink"
    :class="{ 'cursor-not-allowed': disabled, required }"
    :data-name="label"
    :data-selected="modelValue"
  >
    <i v-if="label" :style="{ width: labelSize }">
      {{ label }}
    </i>

    <SelectRoot
      :model-value="modelValue !== undefined ? toInternal(String(modelValue)) : undefined"
      :disabled="disabled"
      @update:model-value="emit('update:modelValue', toExternal($event))"
    >
      <SelectTrigger
        :class="[
          'h-control-md inline-flex grow items-center justify-between gap-2 rounded-md border border-gray-300 bg-white pr-1.5 pl-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50 data-placeholder:text-gray-400',
          $props.class
        ]"
      >
        <SelectValue :placeholder="placeholder ?? '선택'" class="mr-3 whitespace-nowrap" />
        <icon-arrow-down />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          position="popper"
          :side-offset="4"
          class="z-50 w-(--reka-select-trigger-width) rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <SelectScrollUpButton class="flex items-center justify-center py-1 text-gray-500">
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
              <path d="m18 15-6-6-6 6" />
            </svg>
          </SelectScrollUpButton>
          <SelectViewport class="max-h-60 overflow-y-auto p-1">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="toInternal(option.value)"
              :disabled="option.disabled"
              class="relative flex cursor-pointer items-center rounded-sm px-3 py-2 pr-8 text-sm whitespace-nowrap text-gray-900 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-blue-50 data-highlighted:text-blue-700 data-[state=checked]:font-medium"
            >
              <SelectItemText>{{ option.label || '&nbsp;' }}</SelectItemText>
              <SelectItemIndicator class="absolute right-3 flex items-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m20 6-11 11-5-5" />
                </svg>
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton class="flex items-center justify-center py-1 text-gray-500">
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>

    <slot />
  </label>
</template>
