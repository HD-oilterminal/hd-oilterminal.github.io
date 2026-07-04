import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Radio from './Radio.vue'

const ITEMS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'cherry', label: '체리' },
  { value: 'durian', label: '두리안' }
]

const meta: Meta<typeof Radio> = {
  title: 'commons/라디오버튼',
  component: Radio,
  tags: ['autodocs'],
  render: () => ({
    components: { Radio },
    setup() {
      const selected = ref('apple')
      return { selected, items: ITEMS }
    },
    template: `<Radio v-model="selected" :items="items" />`
  })
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {
  render: () => ({
    components: { Radio },
    setup() {
      const selected = ref('apple')
      return { selected, items: ITEMS }
    },
    template: `
      <Radio v-model="selected" :items="items" />
      <p class="mt-3 text-gray-500">선택: {{ selected }}</p>
    `
  })
}

export const Disabled: Story = {
  render: () => ({
    components: { Radio },
    setup() {
      return { items: ITEMS }
    },
    template: `<Radio model-value="apple" :items="items" disabled />`
  })
}
