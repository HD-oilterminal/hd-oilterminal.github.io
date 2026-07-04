<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'

import type { TabItem } from '../../types/core'

withDefaults(
  defineProps<{
    modelValue?: string
    tabs?: TabItem[]
  }>(),
  {
    modelValue: undefined,
    tabs: () => []
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()
</script>

<template>
  <TabsRoot
    :model-value="modelValue"
    class="flex grow flex-col"
    @update:model-value="
      v => {
        emit('update:modelValue', v)
        emit('change', v)
      }
    "
  >
    <TabsList class="flex shrink-0 border-b border-gray-200">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :disabled="tab.disabled"
        :class="[tab.disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
        class="group -mb-px rounded-t px-4 py-2 text-gray-500 transition-colors hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-50 data-[state=active]:border data-[state=active]:border-b data-[state=active]:border-blue-600 data-[state=active]:border-b-white data-[state=active]:font-bold data-[state=active]:text-blue-600"
      >
        {{ tab.label }}
        <span
          v-if="tab.count != null && tab.count > 0"
          class="ml-1.5 inline-flex items-center justify-center rounded-full bg-gray-200/70 px-2 py-0.5 text-xs font-semibold text-gray-400 tabular-nums group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-600"
          >{{ tab.count }}</span
        >
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      force-mount
      class="mt-2 min-h-0 flex-1 focus-visible:outline-none data-[state=inactive]:hidden"
    >
      <slot :name="tab.value" />
    </TabsContent>
  </TabsRoot>
</template>
