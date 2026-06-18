<script setup lang="ts">
import { PopoverAnchor, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open?: boolean
    side?: 'top' | 'right' | 'bottom' | 'left'
    align?: 'start' | 'center' | 'end'
    /**
     * trigger 클릭으로 열고/닫는 대신 위치 기준(anchor)만 제공.
     * 외부에서 `open`을 직접 제어하는 finder 류에 사용.
     */
    asAnchor?: boolean
    /**
     * 열릴 때 content 로 포커스를 가져가지 않고, 포커스 트랩도 비활성화.
     * trigger 의 input 에서 계속 타이핑해야 하는 경우 사용.
     */
    manualFocus?: boolean
  }>(),
  {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    asAnchor: false,
    manualFocus: false
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = ref(props.open ?? false)

watch(
  () => props.open,
  val => {
    if (val !== undefined) isOpen.value = val
  }
)

function handleOpenChange(val: boolean) {
  isOpen.value = val
  emit('update:open', val)
}

function handleOpenAutoFocus(e: Event) {
  if (props.manualFocus) e.preventDefault()
}
</script>

<template>
  <PopoverRoot :open="isOpen" @update:open="handleOpenChange">
    <component :is="asAnchor ? PopoverAnchor : PopoverTrigger" as-child>
      <slot name="trigger" />
    </component>
    <PopoverPortal>
      <PopoverContent
        :side="side"
        :align="align"
        :trap-focus="!manualFocus"
        class="z-50 mt-1.5 rounded-md border border-gray-200 bg-white shadow-lg outline-none"
        @open-auto-focus="handleOpenAutoFocus"
      >
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
