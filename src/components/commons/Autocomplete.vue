<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport
} from 'reka-ui'
import { ref } from 'vue'

export interface Option {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: Option[]
    placeholder?: string
    disabled?: boolean
    emptyText?: string
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '',
    emptyText: '결과 없음'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const isOpen = ref(false)

function filterByLabel(vals: Array<string | Record<string, unknown>>, term: string) {
  if (!term) return vals
  const lower = term.toLowerCase()
  return vals.filter(v => {
    const opt = props.options?.find(o => o.value === v)
    return opt?.label.toLowerCase().includes(lower) ?? false
  })
}
</script>

<template>
  <ComboboxRoot
    :model-value="modelValue"
    :disabled="disabled"
    :open="isOpen"
    :filter-function="filterByLabel"
    class="relative w-full"
    @update:open="isOpen = $event"
    @update:model-value="emit('update:modelValue', $event as string | undefined)"
  >
    <ComboboxAnchor
      class="h-control-md inline-flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm focus-within:ring-2 focus-within:ring-blue-500"
      :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
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
        <circle cx="10" cy="10" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <ComboboxInput
        :placeholder="placeholder"
        :disabled="disabled"
        :display-value="
          (val: unknown) => options?.find(o => o.value === val)?.label ?? String(val ?? '')
        "
        class="w-full bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
        @focus="isOpen = true"
      />
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        :side-offset="4"
        class="z-50 w-(--reka-combobox-trigger-width) rounded-md border border-gray-200 bg-white shadow-lg"
      >
        <ComboboxViewport class="max-h-60 overflow-y-auto p-1">
          <ComboboxEmpty class="py-6 text-center text-sm text-gray-500">{{
            emptyText
          }}</ComboboxEmpty>
          <ComboboxItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="relative flex cursor-pointer items-center rounded-sm px-3 py-2 pr-8 text-sm text-gray-900 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-blue-50 data-highlighted:text-blue-700"
          >
            {{ option.label }}
            <ComboboxItemIndicator class="absolute right-3 flex items-center">
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
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
