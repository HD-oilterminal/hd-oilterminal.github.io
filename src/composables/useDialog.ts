import { shallowRef } from 'vue'

type ConfirmState = {
  type: 'confirm'
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  resolve: (value: boolean) => void
}

type PromptState = {
  type: 'prompt'
  title?: string
  message: string
  placeholder?: string
  defaultValue?: string
  confirmLabel?: string
  cancelLabel?: string
  resolve: (value: string | undefined) => void
}

export type DialogState = ConfirmState | PromptState

export const _dialogState = shallowRef<DialogState | null>(null)

export const useDialog = () => {
  function confirm(
    message: string,
    options?: { title?: string; confirmLabel?: string; cancelLabel?: string }
  ): Promise<boolean> {
    return new Promise(resolve => {
      _dialogState.value = {
        type: 'confirm',
        message,
        title: options?.title,
        confirmLabel: options?.confirmLabel,
        cancelLabel: options?.cancelLabel,
        resolve
      }
    })
  }

  function prompt(
    message: string,
    options?: {
      title?: string
      placeholder?: string
      defaultValue?: string
      confirmLabel?: string
      cancelLabel?: string
    }
  ): Promise<string | undefined> {
    return new Promise(resolve => {
      _dialogState.value = {
        type: 'prompt',
        message,
        title: options?.title,
        placeholder: options?.placeholder,
        defaultValue: options?.defaultValue,
        confirmLabel: options?.confirmLabel,
        cancelLabel: options?.cancelLabel,
        resolve
      }
    })
  }

  return { confirm, prompt }
}
