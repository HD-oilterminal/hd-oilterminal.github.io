import { shallowRef } from 'vue'

type AlertState = {
  title?: string
  message: string
  detail?: string
  confirmLabel?: string
  resolve: () => void
}

export type { AlertState }

export const _alertState = shallowRef<AlertState | null>(null)

export const useAlert = () => {
  function alert(message: string, options?: { title?: string; detail?: string; confirmLabel?: string }): Promise<void> {
    return new Promise(resolve => {
      _alertState.value = {
        message,
        title: options?.title,
        detail: options?.detail,
        confirmLabel: options?.confirmLabel,
        resolve
      }
    })
  }

  return { alert }
}
