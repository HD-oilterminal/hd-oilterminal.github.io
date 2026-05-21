<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {
  DataColumn,
  DataField,
  LocalTreeDataProvider,
  TreeView,
  ValueType,
} from 'realgrid'
import 'realgrid/dist/realgrid-style.css'

const props = withDefaults(
    defineProps<{
      columns: DataColumn[]
      fields?: DataField[]
      rows?: Record<string, unknown>[]
      childrenField?: string
      rootKey?: string
      height?: string
      editable?: boolean
      checkable?: boolean
      parentRowStyle?: string
      childRowStyle?: string
    }>(),
    {
      fields: () => [] as DataField[],
      rows: () => [],
      childrenField: 'children',
      rootKey: 'items',
      height: '400px',
      editable: false,
      checkable: true,
      parentRowStyle: '',
      childRowStyle: '',
    },
)

const emit = defineEmits<{
  ready: [{ grid: TreeView; provider: LocalTreeDataProvider }]
  currentChanged: [row: number, column: string]
}>()

const container = ref<HTMLDivElement>()
let grid: TreeView
let provider: LocalTreeDataProvider

const deriveFields = (): DataField[] =>
    props.fields.length > 0
        ? props.fields
        : props.columns.map((c) => ({
          fieldName: c.fieldName ?? '',
          dataType: ValueType.TEXT,
          defaultValue: '',
          nullValue: '',
          valueCallback: () => undefined,
        }))

const loadRows = () => {
  if (!provider || props.rows.length === 0) return
  const dataObj: Record<string, unknown> = {[props.rootKey]: props.rows}
  provider.setObjectRows(dataObj, props.rootKey, '', props.childrenField)
}

onMounted(() => {
  if (!container.value) return

  provider = new LocalTreeDataProvider(false)
  grid = new TreeView(container.value)

  provider.setFields(deriveFields())
  grid.setColumns(props.columns)
  grid.setEditOptions({editable: props.editable})
  grid.setCheckBar({visible: props.checkable})
  grid.setDataSource(provider)

  if (props.parentRowStyle || props.childRowStyle) {
    const parentStyle = props.parentRowStyle
    const childStyle = props.childRowStyle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grid.setRowStyleCallback((_g: any, item: any) => {
      return (grid as TreeView).getParent(item.dataRowId) !== -1 ? childStyle : parentStyle
    })
  }

  loadRows()

  grid.onCurrentChanged = (_g, newIndex) => {
    emit('currentChanged', newIndex.itemIndex ?? 0, grid?.getCurrent().fieldName ?? '')
  }

  emit('ready', {grid, provider})
})

watch(() => props.rows, loadRows, {deep: true})

onBeforeUnmount(() => {
  grid?.destroy()
  provider?.clearRows()
})

defineExpose({getGrid: () => grid, getProvider: () => provider})
</script>

<template>
  <div ref="container" :style="{ width: '100%', height }"/>
</template>
