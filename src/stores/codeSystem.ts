import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Locale } from 'vue-i18n'

import type { Code, Codes, Option } from '../types/core'

export const SELECT_REQUIRED_LABEL = '<선택>'
export const SELECT_REQUIRED = { value: '', label: SELECT_REQUIRED_LABEL }

let codes: Ref<Codes, Codes>

export const select4Code = (
  code: string,
  tops?: string | boolean | Option | Option[],
  condition?: (code: Code) => boolean
): Option[] => {
  let list = codes.value[code] ?? []
  if (condition) {
    list = list.filter(condition)
  }

  return [
    ...(tops === true
      ? [SELECT_REQUIRED]
      : typeof tops === 'string'
        ? [{ value: '', label: tops }]
        : tops
          ? [tops].flat()
          : []),
    ...list.map((i: any) => ({ value: i.key, label: i.name }))
  ]
}

export const select4Text = (...option: [string, string?][]): Option[] => [
  ...option.map(opt => ({
    value: opt[1],
    label: opt[0]
  }))
]

export const codeSystem = defineStore(
  'code-system',
  () => {
    const locale = ref<Locale>('ko')

    codes = ref<Codes>({})

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
      locale,
      toOptions: select4Code
    }
  },
  {
    persist: { storage: sessionStorage }
  }
)
