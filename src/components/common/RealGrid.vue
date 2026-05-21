<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { DataFieldInput, GridView, LocalDataProvider } from 'realgrid'
import { GridColumn, GridField } from '@/types/grid'
import 'realgrid/dist/realgrid-style.css'

const props = withDefaults(
  defineProps<{
    columns: GridColumn[]
    fields?: GridField[]
    rows?: Record<string, unknown>[]
    height?: string
    editable?: boolean
    checkable?: boolean
  }>(),
  {
    fields: () => [],
    rows: () => [],
    height: '400px',
    editable: false,
    checkable: true,
  }
)

const emit = defineEmits<{
  ready: [{ grid: GridView; provider: LocalDataProvider }]
  currentChanged: [row: number, column: string]
}>()

const container = ref<HTMLDivElement | null>(null)
let grid: GridView | null = null
let provider: LocalDataProvider | null = null

const deriveFields = (): DataFieldInput[] =>
  props.fields.length > 0 ? props.fields : props.columns.map(c => ({ fieldName: c.fieldName }))

onMounted(() => {
  if (!container.value) return

  provider = new LocalDataProvider(false)
  grid = new GridView(container.value)

  provider.setFields(deriveFields())
  grid.setDataSource(provider)
  grid.setColumns(props.columns)
  grid.setEditOptions({ editable: props.editable })
  grid.setCheckBar({ visible: props.checkable })
  grid.onCellClicked = function (grid, clickData) {
    console.log(grid, clickData)
  }

  if (props.rows.length > 0) {
    provider.setRows(props.rows)
  }

  grid.onCurrentChanged = (_g, newIndex) => {
    emit('currentChanged', newIndex.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }

  emit('ready', { grid, provider })
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
  <div ref="container" :style="{ width: '100%', height }" />
</template>
