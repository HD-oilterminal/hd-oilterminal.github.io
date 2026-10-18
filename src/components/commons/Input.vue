<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, watch } from 'vue'

import Icon from '../../components/commons/Icon.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: 'text' | 'number' | 'tel' | 'email' | 'password'
    label?: string
    labelSize?: string
    placeholder?: string
    prefix?: string
    suffix?: string
    icon?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    class?: string
    linking?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    labelSize: '',
    label: '',
    placeholder: '',
    prefix: '',
    suffix: '',
    icon: undefined,
    class: ''
  }
)

defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  'update:modelValue': [value?: string | number]
  iconClick: []
}>()

const instance = getCurrentInstance()
const hasIconClick = computed(() => !!instance?.vnode.props?.onIconClick)

const input = ref<HTMLInputElement>()
const isNumber = computed(() => props.type === 'number')
const isTel = computed(() => props.type === 'tel')

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''

  const areaLen = digits.startsWith('02') ? 2 : 3
  const area = digits.slice(0, areaLen)

  if (digits.length <= areaLen) return area

  const rest = digits.slice(areaLen)

  if (rest.length <= 3) return `${area}-${rest}`

  const middleLen = Math.max(3, Math.min(4, digits.length - areaLen - 4))
  const middle = rest.slice(0, middleLen)
  const last = rest.slice(middleLen)

  return `${area}-${middle}-${last}`
}

function formatRaw(raw: string): string {
  const isNegative = raw.startsWith('-')
  let cleanString = raw.replace(/[^0-9.]/g, '')

  const parts = cleanString.split('.')
  if (parts.length > 2) {
    cleanString = parts[0] + '.' + parts.slice(1).join('')
  }

  let formatted: string
  if (cleanString.includes('.')) {
    const [intPart, decPart] = cleanString.split('.')
    formatted = `${intPart ? Number(intPart).toLocaleString('ko-KR') : ''}.${decPart}`
  } else {
    formatted = cleanString ? Number(cleanString).toLocaleString('ko-KR') : ''
  }

  return isNegative ? '-' + formatted : formatted
}

const digit2Number = (digit?: string) => {
  if (!digit) return undefined
  const result = digit.replace(/,/g, '')
  return result.includes('.') ? parseFloat(result) : parseInt(result)
}

onMounted(() => {
  if (isTel.value) {
    const target = input.value!

    if (props.modelValue) {
      target.value = formatPhone(String(props.modelValue))
    }

    target.addEventListener('keydown', e => {
      const start = target.selectionStart ?? 0
      const end = target.selectionEnd
      if (start === end) {
        if (e.key === 'Backspace' && target.value[start - 1] === '-') {
          target.setSelectionRange(start - 1, start - 1)
        } else if (e.key === 'Delete' && target.value[start] === '-') {
          target.setSelectionRange(start + 1, start + 1)
        }
      }
    })

    target.addEventListener('input', () => {
      const originalValue = target.value
      const originalCursor = target.selectionStart ?? 0
      const digitsBeforeCursor = originalValue.slice(0, originalCursor).replace(/\D/g, '').length

      const formatted = formatPhone(originalValue)
      target.value = formatted

      let newCursor = 0
      let digitCount = 0
      for (let i = 0; i < formatted.length; i++) {
        if (digitCount === digitsBeforeCursor) break
        if (formatted.charAt(i) >= '0' && formatted.charAt(i) <= '9') digitCount++
        newCursor = i + 1
      }
      target.setSelectionRange(newCursor, newCursor)

      emit('update:modelValue', formatted)
    })

    target.addEventListener('focus', () => input.value?.select())
    return
  }

  if (!isNumber.value) return
  const target = input.value!

  if (props.modelValue || 0 === props.modelValue) {
    target.value = formatRaw(props.modelValue + '')
  }

  target.addEventListener('keydown', e => {
    const start = target.selectionStart ?? 0
    const end = target.selectionEnd

    if (start === end) {
      if (e.key === 'Backspace' && target.value[start - 1] === ',') {
        target.setSelectionRange(start - 1, start - 1)
      } else if (e.key === 'Delete' && target.value[start] === ',') {
        target.setSelectionRange(start + 1, start + 1)
      }
    }
  })

  target.addEventListener('input', () => {
    const originalValue = target.value
    const originalCursor = target.selectionStart ?? 0
    const isNeg = originalValue.startsWith('-')
    const leftText = originalValue.slice(0, originalCursor)
    const validCharsBeforeCursor = leftText.replace(/[^0-9.-]/g, '').length

    let cleanString = originalValue.replace(/[^0-9.]/g, '')

    const parts = cleanString.split('.')
    if (parts.length > 2) {
      cleanString = parts[0] + '.' + parts.slice(1).join('')
    }

    let formattedValue: string
    if (cleanString.includes('.')) {
      const [intPart, decPart] = cleanString.split('.')
      formattedValue = `${intPart ? Number(intPart).toLocaleString('ko-KR') : ''}.${decPart}`
    } else {
      formattedValue = cleanString ? Number(cleanString).toLocaleString('ko-KR') : ''
    }

    if (isNeg) formattedValue = '-' + formattedValue

    target.value = formattedValue

    let newCursor = 0
    let validCharCount = 0

    for (let i = 0; i < formattedValue.length; i++) {
      if (validCharCount === validCharsBeforeCursor) break
      if (
        (formattedValue.charAt(i) >= '0' && formattedValue.charAt(i) <= '9') ||
        formattedValue[i] === '.' ||
        formattedValue[i] === '-'
      ) {
        validCharCount++
      }
      newCursor = i + 1
    }

    target.setSelectionRange(newCursor, newCursor)
    emit('update:modelValue', digit2Number(formattedValue))
  })

  target.addEventListener('focus', () => input.value?.select())
})

watch(
  () => props.modelValue,
  newVal => {
    if (!input.value || document.activeElement === input.value) return
    if (isTel.value) {
      input.value.value = newVal ? formatPhone(String(newVal)) : ''
    } else if (isNumber.value) {
      input.value.value = newVal || newVal === 0 ? formatRaw(newVal + '') : ''
    }
  }
)

const iconAction = (e: Event) => {
  if (e instanceof MouseEvent || (e instanceof KeyboardEvent && (e.key === 'Enter' || e.key === 'F2'))) {
    if (props.linking) popupLinking(e)
    emit('iconClick')
  }
}

const popupLinking = (e: Event) => {
  let input

  if (e instanceof MouseEvent) {
    input = (e.target as HTMLElement)?.parentElement?.querySelector('input')
  } else {
    input = e.target
  }

  if (input) {
    e.preventDefault()
    e.stopPropagation()
    document.documentElement.dataset.popupKeyword = (input as HTMLInputElement).value
    setTimeout(() => delete document.documentElement.dataset.popupKeyword, 5000)
  }
}

onMounted(() => {
  input.value?.addEventListener('keyup', iconAction)
})

onUnmounted(() => {
  input.value?.removeEventListener('keyup', iconAction)
})

defineExpose({ input })
</script>

<template>
  <div class="field-wrapper flex w-fit">
    <label
      class="field field-input relative flex w-full items-center gap-1.5"
      :class="{ 'cursor-not-allowed': disabled || required, required, linking }"
      :data-name="label"
    >
      <i
        v-if="label"
        :style="labelSize && { width: labelSize }"
        class="w-(--label-w) shrink-0 text-right text-sm leading-3 font-bold not-italic in-[.required]:before:mr-0.5 in-[.required]:before:text-red-500 in-[.required]:before:content-['*']"
      >
        {{ label }}
      </i>
      <span
        class="flex h-[24px] shrink grow items-center rounded-md border border-gray-300 bg-white px-2 ring-blue-500 focus-within:ring-2 in-[.layer-popup]:max-w-full"
        :class="[
          disabled || readonly ? 'cursor-not-allowed bg-gray-200! opacity-75' : '',
          required ? 'bg-[#fff9f0]!' : '',
          prefix ? 'gap-0!' : '',
          $props.class
        ]"
      >
        <span v-if="prefix" class="shrink-0 text-sm font-bold text-gray-400">{{ prefix }}</span>
        <input
          v-if="!isNumber && !isTel"
          v-bind="$attrs"
          ref="input"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled || readonly"
          :value="modelValue as string"
          class="w-full shrink grow bg-transparent outline-none disabled:cursor-not-allowed disabled:text-gray-800"
          @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
        <input
          v-else-if="isTel"
          v-bind="$attrs"
          ref="input"
          type="text"
          inputmode="tel"
          :placeholder="placeholder"
          :disabled="disabled || readonly"
          class="w-full shrink grow bg-transparent tabular-nums outline-none disabled:cursor-not-allowed disabled:text-gray-800"
          @focusin="(e: Event) => (e.target as HTMLInputElement).select()"
          @copy="
            (e: ClipboardEvent) => {
              const t = e.target as HTMLInputElement
              const sel = t.value.slice(t.selectionStart ?? 0, t.selectionEnd ?? t.value.length)
              e.clipboardData?.setData('text/plain', sel.replace(/\D/g, ''))
              e.preventDefault()
            }
          "
        />
        <input
          v-else
          v-bind="$attrs"
          ref="input"
          type="text"
          inputmode="decimal"
          :placeholder="placeholder"
          :disabled="disabled || readonly"
          class="w-full shrink grow bg-transparent px-0.5 text-right tabular-nums outline-none disabled:cursor-not-allowed disabled:text-gray-800"
          @focusin="(e: Event) => (e.target as HTMLInputElement).select()"
          @copy="
            (e: ClipboardEvent) => {
              const t = e.target as HTMLInputElement
              const sel = t.value.slice(t.selectionStart ?? 0, t.selectionEnd ?? t.value.length)
              e.clipboardData?.setData('text/plain', sel.replace(/,/g, ''))
              e.preventDefault()
            }
          "
        />
        <span v-if="suffix" class="shrink-0 text-sm font-bold text-gray-400" v-html="suffix"></span>
        <icon
          v-if="icon && !disabled"
          :name="icon"
          class="-mr-1 rounded-full"
          :class="{ 'cursor-pointer hover:bg-gray-200': hasIconClick }"
          @click="(e: MouseEvent) => !disabled && iconAction(e)"
        />
      </span>
    </label>

    <slot />
  </div>
</template>
