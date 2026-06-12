<script setup lang="ts">
import type { GridView, LocalDataProvider } from 'realgrid'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { GridProps } from '@/types/grid'

import { useRealGrid } from '../../composables/useRealGrid'
import { gridish } from './RealGrid.options'

const props = withDefaults(defineProps<GridProps>(), {
  fields: () => [],
  rows: () => [],
  height: '100%',
  editable: false
})

const emit = defineEmits<{
  ready: [{ grid: GridView; provider: LocalDataProvider }]
  currentChanged: [row: number, column: string]
}>()

const container = ref<HTMLDivElement>()
let grid: GridView
let provider: LocalDataProvider

const { resolveColumns } = useRealGrid()

onMounted(() => {
  ;({ grid, provider } = gridish('Sample Grid Name', container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  emit('ready', { grid, provider })

  grid.onCurrentChanged = (_g, newIndex) => {
    emit('currentChanged', newIndex.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }
})

watch(
  () => props.rows,
  rows => provider?.setRows(rows),
  { deep: true }
)

onBeforeUnmount(() => {
  grid?.destroy()
  provider?.clearRows()
})

defineExpose({ getGrid: () => grid, getProvider: () => provider })
</script>

<template>
  <div ref="container" class="realgrid-container" :style="{ height }" />
</template>
