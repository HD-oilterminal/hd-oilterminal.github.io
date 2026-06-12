import { useI18n } from 'vue-i18n'

import { useCodesStore } from '@/stores/codes'
import type { Columns } from '@/types/grid'

export function useRealGrid() {
  const codesStore = useCodesStore()
  const { locale } = useI18n()

  function labelOf(item: { name: string; englishName?: string }): string {
    return locale.value === 'ko' ? item.name : (item.englishName ?? item.name)
  }

  function resolveColumns(columns: Columns): Columns {
    return Object.fromEntries(
      Object.entries(columns).map(([key, col]) => {
        if (col.code) {
          const items = codesStore.list(col.code)
          if (items?.length) {
            return [
              key,
              {
                ...col,
                values: items.map(i => i.code),
                labels: items.map(i => labelOf(i))
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
