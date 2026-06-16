import type {
  CellIndex,
  CellLayoutColumnItem,
  ColumnLayoutDirection,
  ColumnStyleObject,
  ColumnSummaryStyleObject,
  DataValues,
  GridBase,
  GridCell,
  LayoutItem,
  ValueType
} from 'realgrid'

export interface GridProps {
  title: string
  columns: Columns
  rows: DataValues[]
  height?: string
  editable?: boolean
  headerHeight?: number
  fixed?: Fixed
}

export interface Fixed {
  column?: number
  row?: number
}

export interface TreeProps extends GridProps {
  treeColumnKey?: string
}

export interface ColumnHeader {
  template?: string
  values?: Record<string, string>
}

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export interface Column {
  key?: string
  width?: number
  type?: ValueType
  header?: ColumnHeader | string
  visible?: boolean
  editable?: boolean
  styleName?: string
  code?: string
  values?: string[]
  labels?: string[]
  align?: TextAlign
  numberFormat?: string
  prefix?: string
  suffix?: string
  displaying?: (grid: GridBase, index: CellIndex, value: unknown) => string | undefined
  styling?: (grid: GridBase, model: GridCell) => string | ColumnStyleObject | ColumnSummaryStyleObject | undefined

  /**
   * 셀 병합
   *
   * sample:
   * <pre>
   * spanning: (grid: GridBase, item: CellLayoutColumnItem, index: number) => {
   *   return (grid as TreeView).getParent(index) === -1 ? 2 : 1
   * }
   * </pre>
   *
   * @return {number} - 값 만큼 셀 병합
   */
  spanning?: (grid: GridBase, item: CellLayoutColumnItem, index: number) => number
}

export interface ColumnGroup {
  header?: ColumnHeader | string
  direction?: ColumnLayoutDirection
  hideChildHeaders?: boolean
  subColumns: Record<string, Column>
}

export type Columns = Record<string, Column | ColumnGroup>

export type ColumnLayout = string | (string | LayoutItem)[]
