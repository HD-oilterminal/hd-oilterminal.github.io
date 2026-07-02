<script setup lang="ts">
import type { ClickData, RowObject } from 'realgrid'
import { GridBase, GridView, LocalDataProvider } from 'realgrid'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import Button from '../../components/commons/Button.vue'
import { useRealGrid } from '../../composables/useRealGrid'
import type { GridProps } from '../../types/core'
import Pagination from '../commons/Pagination.vue'
import { useGrid } from './RealGridOptions'

const props = withDefaults(defineProps<GridProps>(), {
  columns: () => ({}),
  rows: () => [],
  height: '100%',
  editable: false,
  checkable: false
})

const emit = defineEmits<{
  currentChanged: [row: number, column: string]
  cellClicked: [data: ClickData, grid: GridBase]
  rowClicked: [row: RowObject, data: ClickData, grid: GridBase]
  paging: [page: number]
}>()

const { resolveColumns } = useRealGrid()
const { gridish } = useGrid()
const { t } = useI18n()

let core: GridView
let data: LocalDataProvider

const container = ref<HTMLDivElement>()
const pageable = computed(() => {
  return !Array.isArray(props.rows) && // 배열 형태 &
    typeof props.rows.page === 'number' // page 속성 포함 및 숫자 타입 이면, 페이지처리 Ok
    ? props.rows
    : undefined
})

const searchText = ref('')
const searchInput = ref<HTMLInputElement>()
const searchPanel = ref(false)
const searchPosition = ref({ x: 0, y: 0 })

const doSearch = (reverse = false) => {
  if (!searchText.value || !core || !data) return

  const fields = data.getFieldNames()
  const result = core.searchCell({
    fields,
    value: searchText.value,
    startIndex: searchPosition.value.y,
    startFieldIndex: searchPosition.value.x + (reverse ? -1 : 1),
    wrap: true,
    caseSensitive: false,
    partialMatch: true,
    reverse
  })

  if (result != null) {
    core.setCurrent(result)
    searchPosition.value = { x: result.fieldIndex, y: result.itemIndex }
  }
}

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
  rows => data?.setRows(Array.isArray(rows) ? rows : rows.list)
)

onMounted(() => {
  ;({ grid: core, provider: data } = gridish(props.title, container.value, {
    ...props,
    columns: resolveColumns(props.columns)
  }))

  core.onCurrentChanged = (_g, newIndex) => {
    emit('currentChanged', newIndex.itemIndex ?? 0, core?.getCurrent().fieldName ?? '')
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
      searchText.value = ''
      searchPanel.value = true
      searchPosition.value = { x: cell.field ?? 0, y: cell.itemIndex ?? 0 }

      setTimeout(() => searchInput.value?.select(), 50)
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
  get provider() {
    return data
  }
})
</script>

<template>
  <div class="realgrid-wrapper" :style="{ height }">
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
