import { shallowRef } from 'vue'

type AlertState = {
  title?: string
  message: string
  detail?: string
  readonly?: boolean
  confirmLabel?: string
  resolve: () => void
}

export type { AlertState }

export const state = shallowRef<AlertState | null>(null)

export const useAlert = () => {
  function alert(
    message: string,
    options?: { title?: string; detail?: string; readonly?: boolean; confirmLabel?: string }
  ): Promise<void> {
    return new Promise(resolve => {
      state.value = {
        message,
        title: options?.title,
        detail: options?.detail,
        readonly: options?.readonly,
        confirmLabel: options?.confirmLabel,
        resolve
      }
    })
  }

  return { alert }
}
