import { ref } from 'vue'
import type { Locale } from 'vue-i18n'

import type { Code, Codes } from '../types/core'

export const codeSystem = defineStore('code-system', () => {
  const locale = ref<Locale>('ko')

  const codes = ref<Codes>({
    ALBUM: [
      { key: 'KARMA', name: '카르마', english: 'k-a-r-m-a' },
      { key: 'Around', name: '어라운드', english: 'a-r-o-u-n-d' },
      { key: 'Swanson', name: '스완쓴', english: 's-w-a-n-s-o-n' },
      { key: 'BTS', name: '윙즈', english: 'b-t-s' }
    ]
  })

  const load = async (_codes?: Codes) => (codes.value = _codes ?? {})

  const list = (code: string): Code[] => codes.value[code]

  const getName = (code: string, detailCode: any, _locale: Locale = locale.value): any => {
    const found = list(code).find((c: Code) => c.key === detailCode)
    if (!found) return detailCode

    return _locale !== 'ko' ? (found.english ?? found.name) : found.name
  }

  return { all: codes, load, list, getName, locale }
})
