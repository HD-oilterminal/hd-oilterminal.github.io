<script setup lang="ts">
import type { CellIndex, ClickData, DataValues, GridBase, LocalTreeDataProvider, TreeView } from 'realgrid'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useRealGrid } from '../../composables/useRealGrid'
import type { TreeProps } from '../../types/grid'
import { useGrid } from './options'

const props = withDefaults(defineProps<TreeProps>(), {
  columns: () => ({}),
  rows: () => [],
  height: '100%',
  editable: false
})

const emit = defineEmits<{
  ready: [{ grid: TreeView; provider: LocalTreeDataProvider; excel: (rows?: DataValues[], filename?: string) => void }]
  currentChanged: [row: number, column: string]
  cellClicked: [grid: GridBase, clickData: ClickData]
}>()

const container = ref<HTMLDivElement>()
let grid: TreeView
let provider: LocalTreeDataProvider

const { resolveColumns } = useRealGrid()
const { treeish } = useGrid()

onMounted(() => {
  ;({ grid, provider } = treeish('Sample Title', container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  emit('ready', { grid, provider, excel })

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

const excel = (rows?: DataValues[], filename?: string) => {
  if (rows) provider.setRows(rows, props.treeColumnKey ?? '')

  grid.exportGrid({
    type: 'excel',
    target: 'local',
    fileName: filename ?? props.title,
    done: () => {
      if (rows) provider.setRows(props.rows, props.treeColumnKey ?? '')
    }
  })
}
</script>

<template>
  <div ref="container" :style="{ width: '100%', height }" />
</template>
