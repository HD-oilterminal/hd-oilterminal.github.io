<script setup lang="ts">
import {
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
  PaginationRoot
} from 'reka-ui'

withDefaults(
  defineProps<{
    modelValue?: number
    itemsPerPage?: number
    total?: number
    siblingCount?: number
    showEdges?: boolean
  }>(),
  {
    modelValue: 1,
    total: 1,
    itemsPerPage: 10,
    siblingCount: 1,
    showEdges: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const btnBase =
  'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-40'
const btnNav = `${btnBase} border border-gray-300 bg-white text-gray-600 hover:bg-gray-50`
const btnPage = `${btnBase} border border-transparent text-gray-700 hover:bg-gray-100`
const btnActive = `${btnBase} border border-blue-600 bg-blue-600 text-white font-medium`
</script>

<template>
  <PaginationRoot
    :page="modelValue"
    :total="total"
    :items-per-page="itemsPerPage!"
    :sibling-count="siblingCount"
    :show-edges="showEdges"
    @update:page="emit('update:modelValue', $event)"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst :class="btnNav">
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
          <path d="m11 17-5-5 5-5" />
          <path d="m18 17-5-5 5-5" />
        </svg>
      </PaginationFirst>
      <PaginationPrev :class="btnNav">
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </PaginationPrev>

      <template v-for="item in items" :key="item.type === 'page' ? item.value : item.type">
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          :class="item.value === modelValue ? btnActive : btnPage"
        >
          {{ item.value }}
        </PaginationListItem>
        <PaginationEllipsis v-else :class="`${btnBase} cursor-default text-gray-400`">
          ···
        </PaginationEllipsis>
      </template>

      <PaginationNext :class="btnNav">
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
          <path d="m9 18 6-6-6-6" />
        </svg>
      </PaginationNext>
      <PaginationLast :class="btnNav">
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
          <path d="m13 17 5-5-5-5" />
          <path d="m6 17 5-5-5-5" />
        </svg>
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>
