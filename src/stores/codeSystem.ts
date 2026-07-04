import { ref } from 'vue'
import type { Locale } from 'vue-i18n'

import type { Code, Codes } from '../types/core'

export const codeSystem = defineStore(
  'code-system',
  () => {
    const locale = ref<Locale>('ko')

    const codes = ref<Codes>({})

    const load = async (_codes?: Codes) => (codes.value = _codes ?? {})

    const list = (code: string): Code[] => codes.value[code]

    const getName = (code: string, detailCode: any, _locale: Locale = locale.value): any => {
      const found = list(code).find((c: Code) => c.key === detailCode)
      if (!found) return detailCode

      return _locale !== 'ko' ? (found.english ?? found.name) : found.name
    }

    return {
      all: codes,
      load,
      list,
      getName,
      locale
    }
  },
  {
    persist: { pick: ['all'], storage: sessionStorage }
  }
)
