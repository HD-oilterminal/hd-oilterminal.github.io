<script setup lang="ts">
import type { ClickData, RowObject } from 'realgrid'
import { GridBase, GridView, LocalDataProvider } from 'realgrid'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useRealGrid } from '../../composables/useRealGrid'
import type { GridProps, Rows } from '../../types/core'
import Pagination from '../commons/Pagination.vue'
import { useGrid } from './RealGridOptions'

const props = withDefaults(defineProps<GridProps>(), {
  columns: () => ({}),
  rows: () => [],
  height: '100%',
  editable: false,
  checkable: false,
  excel: () => ({ bridge: () => {}, get: () => {} })
})

const emit = defineEmits<{
  currentChanged: [row: number, column: string]
  cellClicked: [data: ClickData, grid: GridBase]
  rowClicked: [row: RowObject, data: ClickData, grid: GridBase]
  paging: [page: number]
}>()

const container = ref<HTMLDivElement>()
const pageable = computed(() => (Array.isArray(props.rows) ? undefined : props.rows))

let core: GridView
let data: LocalDataProvider

const { resolveColumns } = useRealGrid()
const { gridish } = useGrid()

onMounted(() => {
  ;({ grid: core, provider: data } = gridish(props.title, container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  props.excel.bridge(function (rows?: Rows, filename?: string) {
    let raws: Rows
    if (rows) {
      raws = data.getRows()
      data.setRows(rows)
    }

    core.exportGrid({
      type: 'excel',
      target: 'local',
      fileName: filename ?? props.title,
      done: () => raws && data.setRows(raws)
    })
  })

  core.onCurrentChanged = (_g, newIndex) => {
    emit('currentChanged', newIndex.itemIndex ?? 0, core?.getCurrent().fieldName ?? '')
  }

  core.onCellClicked = (grid, value) => {
    emit('cellClicked', value, grid)
    if (value.dataRow != undefined) emit('rowClicked', data.getJsonRow(value.dataRow), value, grid)
  }
})

watch(
  () => props.rows,
  rows => data?.setRows(Array.isArray(rows) ? rows : rows.list)
)

onBeforeUnmount(() => {
  data?.clearRows()
  core?.destroy()
})

defineExpose({
  get grid() {
    return core
  },
  get provider() {
    return data
  }
})
</script>

<template>
  <div class="realgrid-wrapper" :style="{ height }">
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
