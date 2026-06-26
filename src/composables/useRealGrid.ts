import { GridBase } from 'realgrid'
import { useI18n } from 'vue-i18n'

import { codeSystem } from '../stores/codeSystem'
import type { Code, Columns, GridExcel, Rows } from '../types/core'

export const useRealGrid = () => {
  const codes = codeSystem()
  const { locale } = useI18n()

  function labelOf(item: { name: string; english?: string }): string {
    return locale.value === 'ko' ? item.name : (item.english ?? item.name)
  }

  function resolveColumns(columns: Columns): Columns {
    if (Array.isArray(columns?.[0])) return arrayColumns(columns)

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
      this.get = function () {
        return postprocessor()
      }
    },
    get: function () {}
  }
}

export const isChildCell = (grid: GridBase, cell?: number) => {
  const item = grid.getModel(cell!)
  return (item.parentId ?? -1) > -1
}

export const arrayColumns = (array: Columns): Columns => {
  return (array as unknown as any[]).reduce((acc, [key, header, options = {}]) => {
    acc[key] = { header, ...options }
    return acc
  }, {} as Columns)
}
