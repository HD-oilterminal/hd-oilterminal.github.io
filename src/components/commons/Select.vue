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

export interface Option {
  label: string
  value: string
  disabled?: boolean
}

withDefaults(
  defineProps<{
    modelValue?: string
    options?: Option[]
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    placeholder: '',
    options: () => []
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <SelectRoot
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <SelectTrigger
      class="h-control-md data-placeholder:text-gray-400 inline-flex w-full items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <SelectValue :placeholder="placeholder ?? '선택'" />
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
        <path d="m6 9 6 6 6-6" />
      </svg>
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="z-50 w-[var(--reka-select-trigger-width)] rounded-md border border-gray-200 bg-white shadow-lg"
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
            :value="option.value"
            :disabled="option.disabled"
            class="data-disabled:pointer-events-none data-highlighted:bg-blue-50 data-highlighted:text-blue-700 data-disabled:opacity-50 relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 pr-8 text-sm text-gray-900 outline-none data-[state=checked]:font-medium"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
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
</template>
