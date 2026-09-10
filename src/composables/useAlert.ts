import { shallowRef, watch } from 'vue'

type AlertType = 'success' | 'ok' | 'all'

type AlertState = {
  title?: string
  message: string
  detail?: string
  readonly?: boolean
  confirmLabel?: string
  icon?: string
  iconClass?: string
  resolve: () => void
}

export type { AlertState }

export const state = shallowRef<AlertState | null>(null)

const queue: AlertState[] = []

watch(state, value => {
  if (!value && queue.length) {
    state.value = queue.shift()!
  }
})

export const useAlert = () => {
  const alert = async (
    message: string,
    options?: {
      title?: string
      detail?: string
      readonly?: boolean
      confirmLabel?: string
      icon?: string
      iconClass?: string
    }
  ): Promise<void> => {
    return new Promise(resolve => {
      const next: AlertState = {
        message,
        title: options?.title,
        detail: options?.detail,
        readonly: options?.readonly,
        confirmLabel: options?.confirmLabel,
        icon: options?.icon,
        iconClass: options?.iconClass,
        resolve
      }

      if (state.value) {
        queue.push(next)
      } else {
        state.value = next
      }
    })
  }

  return {
    alert,
    async alertOf(type: AlertType, message: string, options?: AlertState) {
      switch (type) {
        case 'success':
          return alert(message, { icon: 'check_circle', iconClass: 'alert-success', ...options })
        case 'ok':
          return alert(message, { icon: 'check', iconClass: 'alert-ok', ...options })
        case 'all':
          return alert(message, { icon: 'data_check', iconClass: 'alert-all', ...options })
      }
    }
  }
}
