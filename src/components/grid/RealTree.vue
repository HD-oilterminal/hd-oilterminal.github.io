<script setup lang="ts">
import type { CellIndex, ClickData, GridBase, LocalTreeDataProvider, TreeView } from 'realgrid'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useRealGrid } from '../../composables/useRealGrid'
import type { Row, Rows, TreeProps } from '../../types/core'
import Pagination from '../commons/Pagination.vue'
import { useGrid } from './RealGridOptions'

const props = withDefaults(defineProps<TreeProps>(), {
  columns: () => ({}),
  rows: () => [],
  height: '100%',
  editable: false
})

const emit = defineEmits<{
  currentChanged: [row: number, column: string]
  cellClicked: [clickData: ClickData, grid: GridBase]
  rowClicked: [row: Row, grid: GridBase]
  paging: [page: number]
}>()

const container = ref<HTMLDivElement>()
let grid: TreeView
let provider: LocalTreeDataProvider

const pageable = computed(() => (Array.isArray(props.rows) ? undefined : props.rows))
const list = computed<Rows>(() => (pageable.value ? pageable.value.list : (props.rows as Rows)))

const { resolveColumns } = useRealGrid()
const { treeish } = useGrid()

onMounted(() => {
  ;({ grid, provider } = treeish('Sample Title', container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  grid.onCurrentChanged = (grid: GridBase, index: CellIndex) => {
    emit('currentChanged', index.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }

  grid.onCellClicked = (grid, value) => {
    emit('cellClicked', value, grid)

    if (value.dataRow != undefined) emit('rowClicked', provider.getJsonRow(value.dataRow)[0], grid)
  }
})

watch(
  () => props.rows,
  () => provider?.setNestedRows({ rows: list.value }, 'rows', props.treeColumnKey ?? '')
)

onBeforeUnmount(() => {
  provider?.clearRows()
  grid?.destroy()
})

const excel = (rows?: Rows, filename?: string) => {
  if (rows) provider.setNestedRows({ rows }, 'rows', props.treeColumnKey ?? '')

  grid.exportGrid({
    type: 'excel',
    target: 'local',
    fileName: filename ?? props.title,
    done: () => {
      if (rows) provider.setNestedRows({ rows: list.value }, 'rows', props.treeColumnKey ?? '')
    }
  })
}

defineExpose({
  get core() {
    return grid
  },
  get data() {
    return provider
  },
  excel
})
</script>

<template>
  <div class="realgrid-wrapper" :style="{ width: '100%', height }">
    <div ref="container" class="realgrid-container" />
    <div v-if="pageable" class="realgrid-pagination">
      <Pagination
        :model-value="pageable.page"
        :items-per-page="1"
        :total="pageable.total_page"
        @update:model-value="emit('paging', $event)"
      />
    </div>
  </div>
</template>
