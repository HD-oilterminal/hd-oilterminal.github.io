import type {
  ConfigObject,
  DataColumn,
  DataFieldInput,
  DataProviderBase,
  GridBase,
  LiteralColumn,
  SeriesColumn
} from 'realgrid'
import { GridView, LocalDataProvider, LocalTreeDataProvider, TreeView, ValueType } from 'realgrid'

import type { Columns, GridProps, TreeProps } from '../../types/grid'

export const treeish = (title: string, container?: HTMLDivElement, props?: GridProps) => {
  if (!container) throw new Error('Container is required!')

  return generate(
    new TreeView(container, false, { title }),
    new LocalTreeDataProvider(false),
    props!
  ) as { grid: TreeView; provider: LocalTreeDataProvider }
}

export const gridish = (title: string, container?: HTMLDivElement, props?: GridProps) => {
  if (!container) throw new Error('Container is required!')

  return generate(
    new GridView(container, false, { title }),
    new LocalDataProvider(false),
    props!
  ) as { grid: GridView; provider: LocalDataProvider }
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

  grid.setColumns(columnsAdapter(props.columns))
  grid.setEditOptions({ editable: props.editable, checkable: true })
  grid.setCheckBar({ visible: true })
  grid.setDisplayOptions({ showTooltip: true, tooltipEllipsisOnly: true }) // 글 줄임("...")의 경우 툴팁으로 표시
  grid.setCopyOptions({ copyDisplayText: true, singleMode: true })
  grid.setDataSource(provider)
  grid.setFixedOptions({ colCount: 2, rowCount: 2 })

  if (props.layout) {
    grid.setColumnLayout(props.layout)
    Object.keys(props.columns).forEach((key) => {
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

const columnsAdapter = (columns: Columns): ColumnType[] => {
  return Object.keys(columns).map((key) => {
    const column = columns[key]
    const def: ColumnType = {
      name: column.key || key,
      fieldName: key,
      width: column.width,
      editable: column.editable ?? false,
      visible: column.visible ?? true
    }

    if (column.header) {
      def.header = typeof column.header === 'string' ? { text: column.header } : column.header
    }

    if (column.styleName) def.styleName = column.styleName
    if (column.displaying) def.displayCallback = column.displaying
    if (column.styling) def.styleCallback = column.styling

    return def
  })
}

const fieldsAdaptor = (columns: Columns): DataFieldInput[] => {
  return Object.keys(columns).map((key) => {
    return {
      fieldName: key,
      dataType: columns[key].type ?? ValueType.TEXT,
      displayCallback: columns[key].displaying,
      nullValue: '',
      defaultValue: ''
    }
  })
}
