/// <reference types="vite/client" />

interface Window {
  _session_time: number
  grid: {
    [key: string]: {
      core: any
      data: any
    }
  }
}
