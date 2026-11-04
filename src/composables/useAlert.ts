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
  const alert = async (message: string, options?: Partial<AlertState> | string): Promise<void> => {
    console.warn(new Error(message))

    return new Promise(resolve => {
      if (typeof options === 'string') {
        options = { title: options }
      }

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
        if (queue.every(q => q.message !== message && (q.detail === undefined || q.detail === next.detail))) {
          queue.push(next)
        }
      } else {
        state.value = next
      }
    })
  }

  return {
    alert,
    async alertOf(type: AlertType | string, message: string, options?: Partial<AlertState> | string) {
      if (typeof options === 'string') {
        options = { title: options }
      }

      switch (type) {
        case 'success':
          return alert(message, { icon: 'check_circle', iconClass: 'alert-success', ...options })
        case 'ok':
          return alert(message, { icon: 'check', iconClass: 'alert-ok', ...options })
        case 'all':
          return alert(message, { icon: 'data_check', iconClass: 'alert-all', ...options })
        default:
          return alert(message, { icon: type, iconClass: 'alert-all', ...options })
      }
    },
    validate: async (form: HTMLFormElement): Promise<{ element?: HTMLElement; label?: string; isSelect?: boolean }> => {
      if (!form) return {}

      for (const field of form.querySelectorAll<HTMLElement>('.required, [required]')) {
        const isSelect = field.hasAttribute('data-selected')
        const control = field.querySelector<HTMLInputElement>('input:not([type=hidden]), textarea, select')
        const value = isSelect ? field.getAttribute('data-selected') : control?.value

        if (field instanceof HTMLInputElement && field.disabled) continue
        if (control?.disabled) continue
        if (value) continue

        const label = field.getAttribute('data-name') || field.querySelector('i')?.textContent?.trim() || ''

        return {
          element: control ?? field,
          label,
          isSelect
        }
      }

      return {}
    }
  }
}
