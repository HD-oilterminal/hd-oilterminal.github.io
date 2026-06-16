import {
  ConfigObject,
  DataColumn,
  DataFieldInput,
  DataProviderBase,
  GridBase,
  GridView,
  LiteralColumn,
  LocalDataProvider,
  LocalTreeDataProvider,
  RestoreMode,
  SelectionMode,
  SelectionStyle,
  SeriesColumn,
  TreeView,
  ValueType
} from 'realgrid'

import type { Columns, GridProps, TreeProps } from '../../types/grid'

export const treeish = (title: string, container?: HTMLDivElement, props?: GridProps) => {
  if (!container) throw new Error('Container is required!')

  return generate(new TreeView(container, false, { title }), new LocalTreeDataProvider(false), props!) as {
    grid: TreeView
    provider: LocalTreeDataProvider
  }
}

export const gridish = (title: string, container?: HTMLDivElement, props?: GridProps) => {
  if (!container) throw new Error('Container is required!')

  return generate(new GridView(container, false, { title }), new LocalDataProvider(false), props!) as {
    grid: GridView
    provider: LocalDataProvider
  }
}

const generate = (
  grid: GridView | TreeView,
  provider: LocalDataProvider | LocalTreeDataProvider,
  props: GridProps | TreeProps
): {
  grid: GridBase
  provider: DataProviderBase
} => {
  provider.setFields(fieldsAdaptor(props.columns))

  if (provider instanceof LocalTreeDataProvider) {
    const rowsProp = (props as TreeProps).rowsProp ?? ''
    if (rowsProp) {
      provider.setObjectRows({ [rowsProp]: props.rows }, rowsProp, '', '')
    }

    provider.setRows(props.rows, rowsProp)
  } else {
    provider.setRows(props.rows)
  }

  grid.setColumns(columnsAdapter(props.columns, props.editable))
  grid.setEditOptions({ editable: props.editable, checkable: true })
  grid.setCheckBar({ visible: true })
  grid.setDisplayOptions({
    showTooltip: true,
    tooltipEllipsisOnly: true,
    selectionMode: SelectionMode.EXTENDED,
    selectionStyle: SelectionStyle.BLOCK
  })
  grid.setCopyOptions({ copyDisplayText: true, singleMode: false })
  grid.setDataSource(provider)
  grid.setFixedOptions({ colCount: props.fixed?.column ?? 0, rowCount: props.fixed?.row ?? 0 })

  if (props.editable) {
    provider.restoreMode = RestoreMode.AUTO
    grid.setStateBar({ visible: true, errorVisible: true })
    grid.setContextMenu([{ label: '수정 취소하기', name: 'restore' }])
    grid.onContextMenuItemClicked = (_grid, menu, data) => {
      if (data.dataRow !== undefined && menu.name === 'restore') provider.restoreUpdatedRows(data.dataRow)
    }
  }

  if (props.layout) {
    grid.setColumnLayout(props.layout)
    Object.keys(props.columns).forEach(key => {
      const col = props.columns[key]
      if (col.spanning) {
        const colLayout = grid.layoutByColumn(col.key || key)
        if (colLayout) colLayout.spanCallback = col.spanning
      }
    })
  }

  if (props.headerHeight) grid.header.height = props.headerHeight

  return {
    grid,
    provider
  }
}

type ColumnType = DataColumn | SeriesColumn | LiteralColumn | ConfigObject | string

const columnsAdapter = (columns: Columns, editable?: boolean): ColumnType[] => {
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
    if (column.textAlign) def.styleName = `${def.styleName ?? ''} rg-data-cell-${column.textAlign}`

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

const fieldsAdaptor = (columns: Columns): DataFieldInput[] => {
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
