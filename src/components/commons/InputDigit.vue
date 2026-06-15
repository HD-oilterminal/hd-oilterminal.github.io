<script setup lang="ts">
import { onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue?: number
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value?: number]
}>()

const input = ref<HTMLInputElement>()

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

onMounted(() => {
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
    const isNegative = originalValue.startsWith('-')
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

    if (isNegative) {
      formattedValue = '-' + formattedValue
    }

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
})

const digit2Number = (digit?: string) => {
  if (!digit) return undefined

  const result = digit.replace(/,/g, '')
  return result.includes('.') ? parseFloat(result) : parseInt(result)
}

watch(
  () => props.modelValue,
  newVal => {
    if (input.value && document.activeElement !== input.value) {
      input.value.value = newVal ? formatRaw(newVal + '') : ''
    }
  }
)
</script>

<template>
  <input
    ref="input"
    type="text"
    inputmode="decimal"
    :placeholder="placeholder"
    :disabled="disabled"
    class="h-control-md rounded-md border border-gray-300 bg-white px-3 font-mono text-sm tabular-nums outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
  />
</template>
