<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'

withDefaults(
  defineProps<{
    content?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    sideOffset?: number
    delayDuration?: number
    disabled?: boolean
  }>(),
  {
    content: '',
    side: 'top',
    sideOffset: 6,
    delayDuration: 300
  }
)
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration" :disable-hoverable-content="true">
    <TooltipRoot :disabled="disabled">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="sideOffset"
          class="z-50 rounded-md bg-gray-900 px-2.5 py-1.5 text-sm text-white shadow-md"
        >
          <slot name="content">{{ content }}</slot>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
