<script setup lang="ts">
defineProps<{
  modelValue?: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  search: []
}>()
</script>

<template>
  <div
    class="flex h-8 overflow-hidden rounded border border-gray-300 bg-white focus-within:border-blue-400"
  >
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder ?? '검색어를 입력하세요'"
      autocomplete="off"
      class="min-w-0 flex-1 px-2.5 text-xs text-gray-700 outline-none placeholder:text-gray-400"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="$emit('search')"
    />
    <button
      type="button"
      class="flex w-8 flex-shrink-0 items-center justify-center border-l border-gray-300 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      @click="$emit('search')"
    >
      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>
</template>
