import {
  type CellIndex,
  type CellLayoutColumnItem,
  type CellLayoutHeader,
  ColumnLayoutDirection,
  type ColumnObject,
  type ConfigObject,
  type DataColumn,
  type DataFieldInput,
  DataProviderBase,
  GridBase,
  GridFitStyle,
  type GridItem,
  GridView,
  type LiteralColumn,
  LocalDataProvider,
  LocalTreeDataProvider,
  RestoreMode,
  SelectionMode,
  SelectionStyle,
  type SeriesColumn,
  TreeExpanderIconStyle,
  TreeView,
  ValueType
} from 'realgrid'
import { useI18n } from 'vue-i18n'

import type { Column, ColumnGroup, ColumnHeader, GridProps, TreeProps } from '../../types/core'

export type TreeGridItem = GridItem & { parentIndex: number }

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

  const rows = (Array.isArray(props.rows) ? props.rows : props.rows?.list) ?? []

  if (provider instanceof LocalTreeDataProvider) {
    const treeColumnKey = (props as TreeProps).treeColumnKey ?? ''
    provider.setNestedRows({ rows }, 'rows', treeColumnKey)
  } else {
    provider.setRows(rows)
  }

  grid.setColumns(columnsAdapter(dataColumns, props.editable))
  grid.setEditOptions({ editable: props.editable, checkable: true })
  grid.setCheckBar({ visible: props.checkable ?? true })
  grid.setDisplayOptions({
    showTooltip: true,
    tooltipEllipsisOnly: true,
    fitStyle: GridFitStyle.EVEN,
    selectionMode: SelectionMode.EXTENDED,
    selectionStyle: SelectionStyle.BLOCK,
    rowHeight: 30
  })
  grid.setCopyOptions({ copyDisplayText: true, singleMode: false })
  grid.setFooter({ visible: false })
  grid.setDataSource(provider)
  grid.setFixedOptions({ colCount: props.fixed?.column ?? 0, rowCount: props.fixed?.row ?? 0 })

  grid.setRowIndicator({ visible: false })
  grid.setStateBar({ visible: !!props.editable, errorVisible: true })

  if (props.editable) {
    provider.restoreMode = RestoreMode.AUTO
    grid.setContextMenu([{ label: t('수정 취소하기'), name: 'restore' }])
    grid.onContextMenuItemClicked = (_grid, menu, data) => {
      if (data.dataRow !== undefined && menu.name === 'restore') provider.restoreUpdatedRows(data.dataRow)
    }
  }

  if (entries.some(([, e]) => 'subColumns' in e)) {
    const spanningColumns: Array<{ key: string; spanning: NonNullable<Column['spanning']> }> = []

    grid.setColumnLayout(
      entries.map(([key, entry]) => {
        if ('subColumns' in entry) {
          const group = entry as ColumnGroup
          return {
            name: key,
            header: composeHeader(group.header),
            direction: group.direction ?? ColumnLayoutDirection.HORIZONTAL,
            hideChildHeaders: group.hideChildHeaders ?? true,
            items: Object.entries(group.subColumns).map(([childKey, childCol]) => {
              if (childCol.spanning)
                spanningColumns.push({
                  key: childKey,
                  spanning: (index, grid, item) => {
                    return childCol.spanning!(index, grid, item)
                  }
                })
              return childKey
            })
          }
        }

        if (entry.spanning) spanningColumns.push({ key, spanning: entry.spanning })

        return key
      })
    )

    for (const { key, spanning } of spanningColumns) {
      const colLayout = grid.layoutByColumn(key)
      if (colLayout)
        colLayout.spanCallback = (grid: GridBase, item: CellLayoutColumnItem, index: number) => {
          return spanning(index, grid, item)
        }
    }

    grid.header.height = 40
  }

  grid.header.height = (props.headerHeight ?? grid.header.height) || 30

  if (grid instanceof TreeView && grid.treeOptions) {
    grid.treeOptions.expanderIconStyle = TreeExpanderIconStyle.SQUARE
    grid.treeOptions.iconVisible = false
    grid.setRowStyleCallback((_, item) => ({
      style: { background: `var(--color-realgrid-row${(item as TreeGridItem).parentIndex > -1 ? '-odd' : ''})` }
    }))
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
      if (Array.isArray(column.header)) {
        def.header = {
          template: (column.header as string[]).slice(1).reduce((a, b) => a + `<i>${b ?? ''}</i>`, column.header[0] ?? ''),
          values: column.header
        }
      } else {
        def.header = typeof column.header === 'string' ? { text: column.header } : column.header
      }
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

    if (column.displaying) {
      const displaying = column.displaying
      def.displayCallback = (_: GridBase, __: CellIndex, ___: unknown) => {
        return displaying(___, __, _)
      }
    }
    if (column.styling) def.styleCallback = column.styling
    if (column.prefix) def.prefix = column.prefix
    if (column.suffix) def.suffix = column.suffix
    if (column.type === ValueType.NUMBER) {
      if (!column.displaying) {
        const fmt = column.numberFormat ?? '#,##0'
        const formatter = new Intl.NumberFormat(undefined, {
          maximumFractionDigits: fmt.includes('.') ? fmt.split('.')[1]?.replace(/[^0#]/g, '').length : 0,
          minimumFractionDigits: fmt.includes('.') ? (fmt.split('.')[1]?.match(/0/g)?.length ?? 0) : 0,
          useGrouping: fmt.includes(',')
        })
        def.displayCallback = (_: GridBase, __: CellIndex, value: unknown) => {
          if (value === null || value === undefined || value === '') return value as string
          const n = Number(value)
          return isNaN(n) ? String(value) : formatter.format(n)
        }
      }
    }

    return def
  })
}

const fieldsAdaptor = (columns: Record<string, Column>): DataFieldInput[] => {
  return Object.keys(columns).map(key => {
    return {
      fieldName: key,
      dataType: ValueType.TEXT,
      displayCallback: columns[key].displaying,
      nullValue: '',
      defaultValue: ''
    }
  })
}

const composeHeader = (header: ColumnHeader | string | string[] = ''): CellLayoutHeader | ColumnObject => {
  if (typeof header === 'string') return { text: header as string }

  if (Array.isArray(header)) {
    return {
      template: (header as string[]).slice(1).reduce((a, b) => a + `<i>${b ?? ''}</i>`, header[0] ?? ''),
      values: header
    }
  }

  return header
}
