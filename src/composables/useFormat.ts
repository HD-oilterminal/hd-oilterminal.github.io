import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// strict 모드(세 번째 인자 true) 포맷 파싱 + 실제 존재하지 않는 날짜(예: 2026-04-31) 거부에 필요
dayjs.extend(customParseFormat)

export const numeric = (value: any, minimumFractionDigits = 3): string => {
  const number = String(value).replace(/(?!^-)[^0-9]/g, '')
  if ('' === number) return number

  return Number(number).toLocaleString('ko', { minimumFractionDigits })
}

export const temporal = (value: any) => {
  const v = Number(value)
  if (!v || isNaN(Number(v)) || v < 1) return ''

  const h = Math.floor(v / 60)
  const m = v % 60
  return h > 0 ? `${h}시간 ${m}분` : `${m}분`
}

export const pad = (value: string | undefined, basic: string, pad: number = 2): string => {
  const n = Number(value)
  if (!value || isNaN(n) || n <= 0) return basic

  return pad ? value.padStart(pad, '0') : value
}

export const padTime = (value: string | undefined, basic: string): string => {
  if (value === undefined) return basic

  const n = Number(value)
  if (isNaN(n) || n < 0) return basic

  return String(n).padStart(2, '0')
}

export const dateString = (value?: DateValue, format = 'YYYY-MM-DD'): string => {
  return value ? dayjs(value.toDate(getLocalTimeZone())).format(format) : ''
}

export const toDate = (value?: string, format = 'YYYY-MM-DD') => {
  if (!value) return undefined

  const parsed = dayjs(value, format, true)
  return parsed.isValid() ? new CalendarDate(parsed.year(), parsed.month() + 1, parsed.date()) : undefined
}

export const paginate = (list: any[], page = 1, pageSize = 10, start = (page - 1) * pageSize) => ({
  page,
  list: list.slice(start, start + pageSize),
  totalCount: list.length,
  total_page: Math.floor(list.length / pageSize) + 1
})
