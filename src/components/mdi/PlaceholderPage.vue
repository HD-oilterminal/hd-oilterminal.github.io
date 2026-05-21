<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
    <svg class="h-12 w-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <p class="text-sm">{{ title ? `${title} — ` : '' }}페이지 준비 중입니다.</p>
  </div>
</template>
