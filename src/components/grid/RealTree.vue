<script setup lang="ts">
import type { CellIndex, ClickData, GridBase, LocalTreeDataProvider, RowObject, TreeView } from 'realgrid'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import Button from '../../components/commons/Button.vue'
import { useRealGrid } from '../../composables/useRealGrid'
import type { TreeProps } from '../../types/core'
import Pagination from '../commons/Pagination.vue'
import { useGrid, useGridSearch } from './RealGridOptions'

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

const { resolveColumns } = useRealGrid()
const { treeish } = useGrid()
const { t } = useI18n()

let core: TreeView
let data: LocalTreeDataProvider

const container = ref<HTMLDivElement>()
const pageable = computed(() => {
  return !Array.isArray(props.rows) && // 배열 형태 &
    typeof props.rows.page === 'number' // page 속성 포함 및 숫자 타입 이면, 페이지처리 Ok
    ? props.rows
    : undefined
})

const { searchText, searchInput, searchPanel, doSearch, openSearch } = useGridSearch({
  grid: () => core,
  data: () => data
})

const excel = (filename?: string) => {
  core.exportGrid({
    type: 'excel',
    target: 'local',
    fileName: filename ?? props.title,
    done: () => console.info('Excel Export Done')
  })
}

watch(
  () => props.rows,
  rows => {
    data?.setNestedRows({ rows: Array.isArray(rows) ? rows : rows.list }, 'rows', props.treeColumnKey ?? '')
    if (props.expanded) core?.expandAll()
  }
)

onMounted(() => {
  ;({ grid: core, provider: data } = treeish(props.title, container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  core.onCurrentChanged = (grid: GridBase, index: CellIndex) => {
    emit('currentChanged', index.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }

  core.onCellClicked = (grid, value) => {
    emit('cellClicked', value, grid)

    if (value.dataRow != undefined) emit('rowClicked', data.getJsonRow(value.dataRow), value, grid)
  }

  core.setContextMenu([
    { label: t('엑셀 다운로드'), name: 'excel' },
    { label: t('검색'), name: 'search' },
    { label: t('틀고정'), name: 'freeze' }
  ])

  core.onContextMenuItemClicked = (_, menu, cell) => {
    if (menu.name === 'excel') excel()
    else if (menu.name === 'search') {
      openSearch(cell)
    } else if (menu.name === 'freeze') {
      const index = core.getColumnNames(true, false).indexOf(cell.column ?? '')
      if (index >= 0) core.setFixedOptions({ colCount: index })
    }
  }
})

onBeforeUnmount(() => {
  data?.clearRows()
  core?.destroy()
})

defineExpose({
  get core() {
    return core
  },
  get data() {
    return data
  }
})
</script>

<template>
  <div class="realgrid-wrapper" :style="{ width: '100%', height }">
    <div ref="container" class="realgrid-container" />
    <Transition name="fade">
      <div v-if="searchPanel" class="realgrid-search-layer">
        <input
          ref="searchInput"
          v-model="searchText"
          :placeholder="`${$t('검색어')} Enter`"
          @keydown.enter="doSearch($event.shiftKey)"
          @keydown.esc="searchPanel = false"
        />
        <Button variant="ghost" type="button" @click="searchPanel = false">{{ $t('닫기') }}</Button>
      </div>
    </Transition>
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
