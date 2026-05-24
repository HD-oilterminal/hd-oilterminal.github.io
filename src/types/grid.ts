import type {
  CellIndex,
  CellLayoutColumnItem,
  ColumnStyleObject,
  ColumnSummaryStyleObject,
  DataValues,
  GridBase,
  GridCell,
  LayoutItem,
  ValueType
} from 'realgrid'

export interface GridProps {
  columns: Columns
  rows: DataValues[]
  height?: string
  editable?: boolean
  layout?: ColumnLayout
  headerHeight?: number
}

export interface TreeProps extends GridProps {
  rowsProp?: string
}

export interface ColumnHeader {
  template?: string
  values?: Record<string, string>
}

export interface Column {
  key?: string
  width?: number
  type?: ValueType
  header?: ColumnHeader | string
  visible?: boolean
  editable?: boolean
  styleName?: string
  values?: string[]
  labels?: string[]
  displaying?: (grid: GridBase, index: CellIndex, value: unknown) => string | undefined
  styling?: (
    grid: GridBase,
    model: GridCell
  ) => string | ColumnStyleObject | ColumnSummaryStyleObject | undefined
  spanning?: (grid: GridBase, layout: CellLayoutColumnItem, itemIndex: number) => number
}

export type Columns = Record<string, Column>

export type ColumnLayout = string | (string | LayoutItem)[]
