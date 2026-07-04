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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { codeSystem } from '../../stores/codeSystem'
import type { Option } from '../../types/core'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    options?: Option[]
    placeholder?: string
    code?: string
    disabled?: boolean
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '',
    code: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const codes = codeSystem()
const { locale } = useI18n()

const resolvedOptions = computed<Option[]>(() => {
  if (!props.code) return props.options ?? []
  return (codes.list(props.code) ?? []).map(i => ({
    value: i.key,
    label: locale.value === 'ko' ? i.name : (i.english ?? i.name)
  }))
})

const isOpen = ref(false)
const searchTerm = ref('')

const filteredOptions = computed(() => {
  if (!searchTerm.value) return resolvedOptions.value

  const lower = searchTerm.value.toLowerCase()
  return resolvedOptions.value.filter(
    o => o.label.toLowerCase().includes(lower) || String(o.value).toLowerCase().includes(lower)
  )
})
</script>

<template>
  <ComboboxRoot
    :model-value="modelValue"
    :disabled="disabled"
    :open="isOpen"
    ignore-filter
    class="relative w-full"
    @update:open="isOpen = $event"
    @update:model-value="emit('update:modelValue', $event as string | undefined)"
  >
    <ComboboxAnchor
      class="h-control-md inline-flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-500"
      :class="disabled ? 'cursor-not-allowed bg-gray-100 opacity-50' : ''"
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
        v-model="searchTerm"
        :placeholder="placeholder || $t('값을 선택 하세요.')"
        :disabled="disabled"
        :display-value="(val: unknown) => resolvedOptions.find(o => o.value === val)?.label ?? String(val ?? '')"
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
          <ComboboxEmpty class="py-6 text-center text-gray-500">{{ $t('결과 없음') }}</ComboboxEmpty>
          <ComboboxItem
            v-for="option in filteredOptions"
            :key="option.value"
            :value="option.value"
            class="relative flex cursor-pointer items-center rounded-sm px-3 py-2 pr-8 text-gray-900 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-blue-50 data-highlighted:text-blue-700"
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
