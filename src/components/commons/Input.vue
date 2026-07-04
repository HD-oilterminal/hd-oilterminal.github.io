<script setup lang="ts">
import { onMounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    label?: string
    labelSize?: string
    placeholder?: string
    prefix?: string
    suffix?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    modelValue: '',
    type: 'text',
    labelSize: '',
    label: '',
    placeholder: '',
    prefix: '',
    suffix: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value?: string | number]
}>()

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
        if (formatted[i] >= '0' && formatted[i] <= '9') digitCount++
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
      if ((formattedValue[i] >= '0' && formattedValue[i] <= '9') || formattedValue[i] === '.' || formattedValue[i] === '-') {
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

defineExpose({ input })
</script>

<template>
  <label class="field field-input relative shrink" :class="{ 'cursor-not-allowed': disabled, required }" :data-name="label">
    <i v-if="label" :style="labelSize && { width: labelSize }">
      {{ label }}
    </i>
    <span
      class="h-control-md flex max-w-50 min-w-20 flex-1 shrink items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-500"
      :class="[disabled ? 'bg-gray-200! opacity-50' : '', required ? 'bg-[#fff9f0]!' : '', prefix ? 'gap-0!' : '']"
    >
      <span v-if="prefix" class="shrink-0 text-gray-600">{{ prefix }}</span>
      <input
        v-if="!isNumber && !isTel"
        ref="input"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :value="modelValue as string"
        class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-400 read-only:cursor-default disabled:cursor-not-allowed disabled:text-gray-800"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <input
        v-else-if="isTel"
        ref="input"
        type="text"
        inputmode="tel"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="min-w-0 flex-1 bg-transparent font-mono tabular-nums outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-800"
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
        ref="input"
        type="text"
        inputmode="decimal"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="min-w-0 flex-1 bg-transparent text-right font-mono tabular-nums outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-800"
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
      <span v-if="suffix" class="shrink-0 text-gray-500">{{ suffix }}</span>
    </span>
    <slot />
  </label>
</template>
