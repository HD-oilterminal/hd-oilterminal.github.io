import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date'
import dayjs from 'dayjs'

export const numeric = (value: unknown, minimumFractionDigits = 3): string => {
  const number = String(value).replace(/(?!^-)[^0-9]/g, '')
  if ('' === number) return number

  return Number(number).toLocaleString('ko', { minimumFractionDigits })
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
