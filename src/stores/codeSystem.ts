import { ref } from 'vue'
import type { Locale } from 'vue-i18n'

export interface Code {
  key: string
  name: string
  english?: string
  sort?: number
}

export type Codes = Record<string, Code[]>

export const codeSystem = defineStore('code-system', () => {
  const { locale: defaultLocale } = useI18n()

  const codes = ref<Codes>({
    ALBUM: [
      { key: 'KARMA', name: '카르마', english: 'k-a-r-m-a' },
      { key: 'Around', name: '어라운드', english: 'a-r-o-u-n-d' },
      { key: 'Swanson', name: '스완쓴', english: 's-w-a-n-s-o-n' },
      { key: 'BTS', name: '윙즈', english: 'b-t-s' }
    ]
  })

  const load = async (_codes?: Codes) => (codes.value = _codes ?? {})

  const list = (code: string): Code[] => codes.value[code] ?? []

  const getName = (code: string, detailCode: string, locale: Locale = defaultLocale.value): string => {
    const found = list(code).find(c => c.key === detailCode)
    if (!found) return detailCode

    return locale !== 'ko' ? (found.english ?? found.name) : found.name
  }

  return { all: codes, load, list, getName }
})
