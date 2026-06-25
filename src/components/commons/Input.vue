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
    labelSize: '6rem',
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
    if (!isNumber.value || !input.value || document.activeElement === input.value) return
    input.value.value = newVal || newVal === 0 ? formatRaw(newVal + '') : ''
  }
)

defineExpose({ input })
</script>

<template>
  <label class="flex min-w-0 shrink items-center gap-2" :class="disabled ? 'cursor-not-allowed' : ''">
    <span
      v-if="label"
      :class="required ? 'required' : ''"
      class="shrink-0 text-right text-gray-500"
      :style="{ width: labelSize }"
    >
      {{ label }}
    </span>
    <span
      class="h-control-md flex min-w-0 flex-1 shrink items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-500"
      :class="disabled ? 'bg-gray-100 opacity-40' : ''"
    >
      <span v-if="prefix" class="shrink-0 text-sm text-gray-600">{{ prefix }}</span>
      <input
        v-if="!isNumber"
        ref="input"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :value="modelValue as string"
        class="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 read-only:cursor-default disabled:cursor-not-allowed disabled:text-gray-400"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <input
        v-else
        ref="input"
        type="text"
        inputmode="decimal"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        class="min-w-0 flex-1 bg-transparent text-right font-mono text-sm tabular-nums outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-400"
      />
      <span v-if="suffix" class="shrink-0 text-sm text-gray-500">{{ suffix }}</span>
    </span>
  </label>
</template>

<style scoped>
span.required::before {
  content: '*';
  color: var(--color-red-500);
  margin-right: var(--spacing);
}
</style>
