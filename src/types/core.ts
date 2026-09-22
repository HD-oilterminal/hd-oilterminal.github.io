import type {
  CellIndex,
  CellLayoutColumnItem,
  ColumnLayoutDirection,
  ColumnStyleObject,
  ColumnSummaryStyleObject,
  GridBase,
  GridCell,
  GridView,
  LocalDataProvider,
  LocalTreeDataProvider,
  RowObject,
  TreeView,
  ValueType
} from 'realgrid'
import type { useI18n } from 'vue-i18n'

export interface Code {
  key: string
  name: string
  english?: string
  order?: number
}

export type Codes = Record<string, Code[]>

export type CodeSystem = ReturnType<typeof codeSystem>

export type Translator = ReturnType<typeof useI18n>['t']

export interface GridProps {
  /**
   * 그리드 제목 (엑셀 다운로드 파일명으로 사용)
   */
  title: string
  columns: Columns | ArrayColumns
  id?: string
  rows?: Rows | PagedRows
  height?: string
  checkable?: boolean
  editable?: boolean
  groupable?: boolean
  /**
   * 그리드 행번호 표시
   */
  numberable?: boolean
  headerHeight?: number
  fixed?: Fixed
  excel?: GridExcel
  /**
   * 페이지당 표출되는 행의 개수
   */
  size?: number
}

export type Row = RowObject
export type Rows = Row[]

export type PagedRows = {
  totalCount: number
  total_page: number
  page: number
  size?: number
  list: Rows
}

// 그리드/트리를 교집합으로 선언해 G[id] 에서 캐스팅 없이 양쪽 메서드를 쓸 수 있게 한다 (대입 지점에서 as GridEntry)
export type GridEntry = GridView &
  TreeView & {
    provider: LocalDataProvider & LocalTreeDataProvider
  }

export type GridExcel = { bridge: Function; get: (filename?: string | undefined | null, rows?: Rows) => void }

export interface Fixed {
  column?: number
  row?: number
}

export interface TreeProps extends GridProps {
  treeColumnKey?: string
  expanded?: boolean
}

export interface ColumnHeader {
  template?: string
  values?: Record<string, string>
  templateEvents?: Array<{
    selector: string
    event: Record<string, (event: Event) => void>
  }>
}

export interface Column {
  key?: string
  width?: number
  type?: ValueType
  header?: ColumnHeader | string | string[]
  visible?: boolean
  editable?: boolean
  styleName?: string
  code?: string
  values?: string[]
  labels?: string[]
  align?: 'left' | 'right' | 'center'
  numberFormat?: string
  prefix?: string
  suffix?: string
  renderer?: Record<string, unknown>
  displaying?: (value: any, cell: CellIndex, grid: GridBase) => any

  /**
   * 그룹핑(groupable) 시 그룹 푸터에 표시할 요약 값.
   * 'sum' | 'avg' 또는 그룹에 속한 행들을 받아 직접 계산하는 함수.
   * displaying 이 지정돼 있으면 계산 결과에도 동일하게 적용
   */
  summary?: 'sum' | 'avg' | ((rows: Rows) => any)
  styling?: (cell: GridCell, grid: GridBase) => string | ColumnStyleObject | ColumnSummaryStyleObject | undefined

  /**
   * 셀 병합
   *
   * sample:
   * <pre>
   * spanning: (index: number, grid: GridBase, item: CellLayoutColumnItem) => {
   *   return (grid as TreeView).getParent(index) === -1 ? 2 : 1
   * }
   * </pre>
   *
   * @return {number} - 값 만큼 셀 병합
   */
  spanning?: (index: number, grid: GridBase, item: CellLayoutColumnItem) => number
}

export interface ColumnGroup {
  header?: string | string[] | ColumnHeader
  direction?: ColumnLayoutDirection
  /**
   * 하위 컬럼 헤더 숨김 여부 (기본 false)
   */
  hideChildHeaders?: boolean
  subColumns: Record<string, Column>
}

export type Columns = Record<string, Column | ColumnGroup>

export type ArrayColumns = [string, (string | string[] | ColumnHeader)?, Column?][]

export interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

export interface TabItem extends Option {
  count?: number
}
