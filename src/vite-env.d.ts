/// <reference types="vite/client" />

interface Window {
  _session_time: number
}

declare var G: Record<string, import('./types/core').GridEntry>
