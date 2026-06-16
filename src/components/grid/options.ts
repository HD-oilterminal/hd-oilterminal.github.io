import type { ConfigObject, DataColumn, DataFieldInput, LiteralColumn, SeriesColumn } from 'realgrid'
import {
  ColumnLayoutDirection,
  DataProviderBase,
  GridBase,
  GridView,
  LocalDataProvider,
  LocalTreeDataProvider,
  RestoreMode,
  SelectionMode,
  SelectionStyle,
  TreeExpanderIconStyle,
  TreeView,
  ValueType
} from 'realgrid'
import { useI18n } from 'vue-i18n'

import type { Column, ColumnGroup, GridProps, TreeProps } from '../../types/grid'

//
export const useGrid = () => {
  const { t } = useI18n()

  return {
    gridish: (title: string, container?: HTMLDivElement, props?: GridProps) => _gridish(title, container, props, t),
    treeish: (title: string, container?: HTMLDivElement, props?: TreeProps) => _treeish(title, container, props, t)
  }
}

const _treeish = (title: string, container?: HTMLDivElement, props?: TreeProps, t?: (key: string) => string) => {
  if (!container) throw new Error('Container is required!')

  return generate(new TreeView(container, false, { title }), new LocalTreeDataProvider(false), props!, t!) as {
    grid: TreeView
    provider: LocalTreeDataProvider
  }
}

const _gridish = (title: string, container?: HTMLDivElement, props?: GridProps, t?: (key: string) => string) => {
  if (!container) throw new Error('Container is required!')

  return generate(new GridView(container, false, { title }), new LocalDataProvider(false), props!, t!) as {
    grid: GridView
    provider: LocalDataProvider
  }
}

const generate = (
  grid: GridView | TreeView,
  provider: LocalDataProvider | LocalTreeDataProvider,
  props: GridProps | TreeProps,
  t: (key: string) => string
): {
  grid: GridBase
  provider: DataProviderBase
} => {
  const entries = Object.entries(props.columns) as Array<[string, Column | ColumnGroup]>

  // top-level columns + all group children merged into dataColumns
  const dataColumns: Record<string, Column> = {}
  for (const [key, entry] of entries) {
    if ('subColumns' in entry) {
      Object.assign(dataColumns, (entry as ColumnGroup).subColumns)
    } else {
      dataColumns[key] = entry as Column
    }
  }

  provider.setFields(fieldsAdaptor(dataColumns))

  if (provider instanceof LocalTreeDataProvider) {
    const treeColumnKey = (props as TreeProps).treeColumnKey ?? ''
    if (treeColumnKey) {
      provider.setObjectRows({ [treeColumnKey]: props.rows }, treeColumnKey, '', '')
    }

    provider.setRows(props.rows, treeColumnKey)
  } else {
    provider.setRows(props.rows)
  }

  grid.setColumns(columnsAdapter(dataColumns, props.editable))
  grid.setEditOptions({ editable: props.editable, checkable: true })
  grid.setCheckBar({ visible: true })
  grid.setDisplayOptions({
    showTooltip: true,
    tooltipEllipsisOnly: true,
    selectionMode: SelectionMode.EXTENDED,
    selectionStyle: SelectionStyle.BLOCK
  })
  grid.setCopyOptions({ copyDisplayText: true, singleMode: false })
  grid.setFooter({ visible: false })
  grid.setDataSource(provider)
  grid.setFixedOptions({ colCount: props.fixed?.column ?? 0, rowCount: props.fixed?.row ?? 0 })

  grid.setRowIndicator({ visible: false })
  grid.setStateBar({ visible: !!props.editable, errorVisible: true })

  if (props.editable) {
    provider.restoreMode = RestoreMode.AUTO
    grid.setContextMenu([{ label: t('grid.context.restore'), name: 'restore' }])
    grid.onContextMenuItemClicked = (_grid, menu, data) => {
      if (data.dataRow !== undefined && menu.name === 'restore') provider.restoreUpdatedRows(data.dataRow)
    }
  }

  if (entries.some(([, e]) => 'subColumns' in e)) {
    grid.setColumnLayout(
      entries.map(([key, entry]) => {
        if ('subColumns' in entry) {
          const group = entry as ColumnGroup
          return {
            name: key,
            header: typeof group.header === 'string' ? { text: group.header } : group.header,
            direction: group.direction ?? ColumnLayoutDirection.HORIZONTAL,
            hideChildHeaders: group.hideChildHeaders ?? true,
            items: Object.entries(group.subColumns).map(([childKey, childCol]) => childCol.key || childKey)
          }
        }
        const col = entry as Column
        return col.key || key
      })
    )

    for (const [key, entry] of entries) {
      if ('items' in entry) {
        for (const [childKey, childCol] of Object.entries((entry as ColumnGroup).subColumns)) {
          if (childCol.spanning) {
            const colLayout = grid.layoutByColumn(childCol.key || childKey)
            if (colLayout) colLayout.spanCallback = childCol.spanning
          }
        }
      } else {
        const col = entry as Column
        if (col.spanning) {
          const colLayout = grid.layoutByColumn(col.key || key)
          if (colLayout) colLayout.spanCallback = col.spanning
        }
      }
    }
  }

  if (props.headerHeight) grid.header.height = props.headerHeight

  if (grid instanceof TreeView && grid.treeOptions) {
    grid.treeOptions.expanderIconStyle = TreeExpanderIconStyle.SQUARE
    grid.treeOptions.iconVisible = false
  }

  return {
    grid,
    provider
  }
}

type ColumnType = DataColumn | SeriesColumn | LiteralColumn | ConfigObject | string

const columnsAdapter = (columns: Record<string, Column>, editable?: boolean): ColumnType[] => {
  return Object.keys(columns).map(key => {
    const column = columns[key]
    const def: ColumnType = {
      name: column.key || key,
      fieldName: key,
      width: column.width,
      type: column.type ?? ValueType.TEXT,
      editable: column.editable ?? editable ?? false,
      visible: column.visible ?? true
    }

    if (column.header) {
      def.header = typeof column.header === 'string' ? { text: column.header } : column.header
    }

    if (column.styleName) def.styleName = column.styleName
    if (column.align) def.styleName = `${def.styleName ?? ''} rg-data-cell-${column.align}`

    if (column.values?.length) {
      def.values = column.values
      def.labels = column.labels
      def.lookupDisplay = true
      if (def.editable) {
        def.editor = {
          type: 'dropdown',
          domainOnly: true,
          textReadOnly: true,
          dropDownWhenClick: true,
          dropDownWhenEnter: true
        }
        def.editButtonVisibility = 'hidden'
      }
    }

    if (column.displaying) def.displayCallback = column.displaying
    if (column.styling) def.styleCallback = column.styling
    if (column.prefix) def.prefix = column.prefix
    if (column.suffix) def.suffix = column.suffix
    if (column.type === ValueType.NUMBER) {
      def.numberFormat = column.numberFormat ?? '#,##0'
      def.styleName = (def.styleName ?? '') + ' rg-data-cell-right'
    }

    return def
  })
}

const fieldsAdaptor = (columns: Record<string, Column>): DataFieldInput[] => {
  return Object.keys(columns).map(key => {
    return {
      fieldName: key,
      dataType: columns[key].type ?? ValueType.TEXT,
      displayCallback: columns[key].displaying,
      nullValue: '',
      defaultValue: ''
    }
  })
}
