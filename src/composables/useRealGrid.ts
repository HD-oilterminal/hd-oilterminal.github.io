import { GridBase } from 'realgrid'
import { useI18n } from 'vue-i18n'

import { codeSystem } from '../stores/codeSystem'
import type { ArrayColumns, Code, Columns, GridExcel, Rows } from '../types/core'

export const useRealGrid = () => {
  const codes = codeSystem()
  const { locale } = useI18n()

  function labelOf(item: { name: string; english?: string }): string {
    return locale.value === 'ko' ? item.name : (item.english ?? item.name)
  }

  function resolveColumns(columns: Columns | ArrayColumns): Columns {
    if (Array.isArray(columns)) columns = arrayColumns(columns as ArrayColumns)

    return Object.fromEntries(
      Object.entries(columns as Columns).map(([key, col]) => {
        if (!('subColumns' in col) && col.code) {
          const items: Code[] = codes.list(col.code)
          if (items?.length) {
            return [
              key,
              {
                ...col,
                values: items.map((i: Code) => i.key),
                labels: items.map((i: Code) => labelOf(i))
              }
            ]
          }
        }
        return [key, col]
      })
    )
  }

  return { resolveColumns }
}

export const useGridExcel = (): GridExcel => {
  return {
    bridge: function (postprocessor: (rows?: Rows, filename?: string) => void) {
      this.get = function (filename?: string | null, rows?: Rows) {
        return postprocessor(rows, filename ?? undefined)
      }
    },
    get: function () {}
  }
}

export const isChildCell = (grid: GridBase, cell?: number) => {
  const item = grid.getModel(cell!)
  return (item.parentId ?? -1) > -1
}

export const arrayColumns = (array: ArrayColumns): Columns => {
  return array.reduce((acc, [key, header = key, options = {}]) => {
    acc[key] = { header, ...options }
    return acc
  }, {} as Columns)
}
