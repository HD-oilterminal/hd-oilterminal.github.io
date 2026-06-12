<script setup lang="ts">
import type { CellIndex, ClickData, GridBase, LocalTreeDataProvider, TreeView } from 'realgrid'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import type { TreeProps } from '@/types/grid'

import { useRealGrid } from '../../composables/useRealGrid'
import { treeish } from './RealGrid.options'

const props = withDefaults(defineProps<TreeProps>(), {
  columns: () => ({}),
  rows: () => [],
  rowsProp: undefined,
  height: '400px',
  editable: false,
  layout: undefined,
  headerHeight: undefined
})

const emit = defineEmits<{
  ready: [{ grid: TreeView; provider: LocalTreeDataProvider }]
  currentChanged: [row: number, column: string]
  cellClicked: [grid: GridBase, clickData: ClickData]
}>()

const container = ref<HTMLDivElement>()
let grid: TreeView
let provider: LocalTreeDataProvider

const { resolveColumns } = useRealGrid()

onMounted(() => {
  ;({ grid, provider } = treeish('Sample Title', container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  emit('ready', { grid, provider })

  grid.onCurrentChanged = (grid: GridBase, index: CellIndex) => {
    emit('currentChanged', index.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }

  grid.onCellClicked = (grid, value) => {
    emit('cellClicked', grid, value)
  }
})

onBeforeUnmount(() => {
  provider?.clearRows()
  grid?.destroy()
})

defineExpose({ getGrid: () => grid, getProvider: () => provider })
</script>

<template>
  <div ref="container" :style="{ width: '100%', height }" />
</template>
