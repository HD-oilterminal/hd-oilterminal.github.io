import { DataColumn, DataField, GridHeader, ValueType } from 'realgrid'

export interface GridColumn extends DataColumn {
  name: string
  fieldName?: string
  dataType?: ValueType
  header?: GridHeader //string | { text: string } | { template: string; values: Record<string, string> }
  width?: number
  editable?: boolean
  checkable?: boolean
}

export interface GridField extends DataField {
  fieldName: string
  dataType?: ValueType
}

export type GridData = Record<string, unknown>
