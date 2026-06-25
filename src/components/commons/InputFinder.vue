<script setup lang="ts">
import type { RowObject } from 'realgrid'
import { nextTick, ref } from 'vue'

import { paginate } from '../../composables/useFormat'
import type { Columns, PagedRows, Row, Rows } from '../../types/core'
import RealGrid from '../grid/RealGrid.vue'
import Input from './Input.vue'
import Popover from './Popover.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: unknown
    display?: string
    label?: string
    labelSize?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    size?: string
    grid: { searchColumn: string; columns: Columns; rows: Rows }
  }>(),
  {
    modelValue: undefined,
    display: undefined,
    label: '',
    labelSize: 'auto',
    placeholder: '',
    size: '320px'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value?: unknown]
}>()

//
const isOpen = ref(false)
const expanded = ref(true)
const keyword = reactive<{ intern: string; extern: string; ref: HTMLInputElement[] }>({
  extern: '',
  intern: '',
  ref: []
})
const page = ref(1)

//
const onEnter = () => {
  if (keyword.extern.trim().length < 2) return

  keyword.intern = keyword.extern

  if (rows.value.totalCount === 0) return (keyword.extern = keyword.intern = '')
  if (rows.value.totalCount === 1) return select(rows.value.list[0])

  isOpen.value = true
}

const select = (row?: RowObject) => {
  keyword.extern = row?.[props.grid.searchColumn]
  isOpen.value = false

  emit('update:modelValue', row)
}

//
const rows = computed<PagedRows>(() => {
  const t = keyword.intern.trim().toLowerCase()
  const list = t
    ? props.grid.rows.filter((r: Row) => `${r[props.grid.searchColumn]}`.toLowerCase().includes(t))
    : props.grid.rows

  return paginate(list, page.value)
})

watch(isOpen, opened => {
  if (opened) {
    keyword.intern = keyword.extern

    nextTick(() => keyword.ref[1].focus())
  } else {
    keyword.intern = ''
    page.value = 1

    setTimeout(() => keyword.ref[0].select())
  }
})

watch(keyword, ({ extern }) => {
  if (!extern) emit('update:modelValue', undefined)
})
</script>

<template>
  <Popover v-model:open="isOpen" as-anchor>
    <template #trigger>
      <div class="relative w-full">
        <Input
          :ref="(e: any) => (keyword.ref[0] = e.input as HTMLInputElement)"
          :model-value="keyword.extern"
          :label="label"
          :label-size="labelSize"
          :placeholder="placeholder"
          :required="required"
          :disabled="disabled"
          @update:model-value="keyword.extern = $event as string"
          @keyup.enter.prevent="onEnter"
        />
        <button
          type="button"
          :disabled="disabled"
          class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          @click="isOpen = !isOpen"
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
            <circle cx="10" cy="10" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </div>
    </template>

    <div :style="{ width: size }" class="flex flex-col">
      <div class="border-b border-gray-200 p-3">
        <div class="flex items-center gap-2">
          <span
            class="h-control-md flex flex-1 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-500"
          >
            <input
              :ref="e => (keyword.ref[1] = e as HTMLInputElement)"
              v-model="keyword.intern"
              type="text"
              class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </span>
          <button
            v-if="$slots.head"
            type="button"
            class="flex size-7.5 shrink-0 items-center justify-center rounded border border-gray-300 text-gray-500 hover:bg-gray-50"
            :aria-expanded="expanded"
            aria-label="검색 확장"
            @click="expanded = !expanded"
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
              class="transition-transform"
              :class="expanded ? 'rotate-180' : ''"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
        <div v-if="$slots.head && expanded" class="mt-2">
          <slot name="head" v-bind="{ keyword }" />
        </div>
      </div>

      <RealGrid
        title="finder"
        :columns="grid.columns"
        :rows="rows"
        :checkable="false"
        height="300px"
        class="p-3"
        @paging="page = $event"
        @row-clicked="select"
      />
    </div>
  </Popover>
</template>
