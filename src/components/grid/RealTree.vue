<script setup lang="ts">
import type { CellIndex, ClickData, GridBase, LocalTreeDataProvider, RowObject, TreeView } from 'realgrid'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useRealGrid } from '../../composables/useRealGrid'
import type { Rows, TreeProps } from '../../types/core'
import Pagination from '../commons/Pagination.vue'
import { useGrid } from './RealGridOptions'

const props = withDefaults(defineProps<TreeProps>(), {
  columns: () => ({}),
  rows: () => [],
  height: '100%',
  editable: false,
  expanded: false
})

const emit = defineEmits<{
  currentChanged: [row: number, column: string]
  cellClicked: [clickData: ClickData, grid: GridBase]
  rowClicked: [row: RowObject, data: ClickData, grid: GridBase]
  paging: [page: number]
}>()

const container = ref<HTMLDivElement>()
let grid: TreeView
let data: LocalTreeDataProvider

const pageable = computed(() => {
  return !Array.isArray(props.rows) && // 배열 형태
    typeof props.rows.page === 'number' // page 속성 포함 및 숫자 타입
    ? props.rows
    : undefined
})
const list = computed<Rows>(() => (pageable.value ? pageable.value.list : (props.rows as Rows)))

const { resolveColumns } = useRealGrid()
const { treeish } = useGrid()

onMounted(() => {
  ;({ grid, provider: data } = treeish('Sample Title', container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  grid.onCurrentChanged = (grid: GridBase, index: CellIndex) => {
    emit('currentChanged', index.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }

  grid.onCellClicked = (grid, value) => {
    emit('cellClicked', value, grid)

    if (value.dataRow != undefined) emit('rowClicked', data.getJsonRow(value.dataRow), value, grid)
  }
})

watch(
  () => props.rows,
  () => {
    data?.setNestedRows({ rows: list.value }, 'rows', props.treeColumnKey ?? '')
    if (props.expanded) grid?.expandAll()
  }
)

onBeforeUnmount(() => {
  data?.clearRows()
  grid?.destroy()
})

const excel = (rows?: Rows, filename?: string) => {
  if (rows) data.setNestedRows({ rows }, 'rows', props.treeColumnKey ?? '')

  grid.exportGrid({
    type: 'excel',
    target: 'local',
    fileName: filename ?? props.title,
    done: () => {
      if (rows) data.setNestedRows({ rows: list.value }, 'rows', props.treeColumnKey ?? '')
    }
  })
}

defineExpose({
  get core() {
    return grid
  },
  get data() {
    return data
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
