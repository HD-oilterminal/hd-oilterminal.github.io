<script setup lang="ts">
import type { ClickData, DataValues, GridBase, GridView, LocalDataProvider } from 'realgrid'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { useRealGrid } from '../../composables/useRealGrid'
import type { GridProps } from '../../types/grid'
import { useGrid } from './options'

const props = withDefaults(defineProps<GridProps>(), {
  columns: () => ({}),
  rows: () => [],
  height: '100%',
  editable: false
})

const emit = defineEmits<{
  ready: [{ grid: GridView; provider: LocalDataProvider; excel: (rows?: DataValues[], filename?: string) => void }]
  currentChanged: [row: number, column: string]
  cellClicked: [grid: GridBase, clickData: ClickData]
}>()

const container = ref<HTMLDivElement>()
let grid: GridView
let provider: LocalDataProvider

const { resolveColumns } = useRealGrid()
const { gridish } = useGrid()

onMounted(() => {
  ;({ grid, provider } = gridish(props.title, container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  emit('ready', { grid, provider, excel })

  grid.onCurrentChanged = (_g, newIndex) => {
    emit('currentChanged', newIndex.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
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
  if (rows) provider.setRows(rows)

  grid.exportGrid({
    type: 'excel',
    target: 'local',
    fileName: filename ?? props.title,
    done: () => rows && provider.setRows(props.rows)
  })
}
</script>

<template>
  <div ref="container" class="realgrid-container" :style="{ height }" />
</template>
