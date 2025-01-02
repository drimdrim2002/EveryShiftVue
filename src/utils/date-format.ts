import { useDateFormat } from '@vueuse/core'

export const dateToSupabaseDateString = (datetime: Date) => {
  const formattedDateString = useDateFormat(datetime, 'YYYY-MM-DDTHH:mm:ss.SSS+ZZ:ZZ')

  return formattedDateString
}

export const toISOStringWithTimezone = (date: Date) => {
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0')
  const tzOffset = -date.getTimezoneOffset()
  const diff = tzOffset >= 0 ? '+' : '-'
  const timezone = diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60)

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    '.' +
    pad(date.getMilliseconds()) +
    timezone
  )
}
