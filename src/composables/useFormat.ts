import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date'
import dayjs from 'dayjs'

export const useFormat = () => {
  return {
    numeric: (value: unknown, minimumFractionDigits = 3): string => {
      const number = String(value).replace(/(?!^-)[^0-9]/g, '')
      if ('' === number) return number

      return Number(number).toLocaleString('ko', { minimumFractionDigits })
    },
    dateString: (value?: DateValue, format = 'YYYY-MM-DD'): string => {
      return value ? dayjs(value.toDate(getLocalTimeZone())).format(format) : ''
    },
    toDate: (value?: string, format = 'YYYY-MM-DD') => {
      if (!value) return undefined

      const date = dayjs(value, format)
      return date.isValid()
        ? new CalendarDate(date.year(), date.month() + 1, date.date())
        : undefined
    }
  }
}
