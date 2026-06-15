import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import InputDigit from './InputDigit.vue'

const meta: Meta<typeof InputDigit> = {
  title: 'commons/입력-숫자',
  component: InputDigit,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof InputDigit>

export const Default: Story = {
  parameters: {
    docs: { source: { code: `<InputDigit />` } }
  },
  render: () => ({
    components: { InputDigit },
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-400">-를 먼저 입력하면 음수 지원, 소수점 입력 가능</p>
        <InputDigit />
      </div>
    `
  })
}

export const WithPlaceholder: Story = {
  name: '플레이스홀더',
  parameters: {
    docs: { source: { code: `<InputDigit v-model="value" placeholder="숫자만 입력" />` } }
  },
  render: () => ({
    components: { InputDigit },
    setup() {
      const display = ref('')
      return { display }
    },
    template: `
      <div class="space-y-2">
        <InputDigit v-model="display" placeholder="숫자만 입력" />
        <p class="text-sm text-gray-500">입력값: {{ display || '없음' }}</p>
      </div>
    `
  })
}

export const Disabled: Story = {
  name: '비활성화',
  parameters: {
    docs: {
      source: {
        code: `<InputDigit v-model="value" disabled />`
      }
    }
  },
  render: () => ({
    components: { InputDigit },
    setup() {
      const display = ref(-123456.789)
      return { display }
    },
    template: `<InputDigit v-model="display" disabled class="w-32" />`
  })
}
