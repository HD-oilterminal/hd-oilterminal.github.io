import type { Dayjs } from 'dayjs'

declare module '#app' {
  interface NuxtApp {
    $dayjs: typeof import('dayjs') & ((date?: Parameters<typeof import('dayjs')>[0]) => Dayjs)
  }
}

export {}
