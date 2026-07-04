import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Select from './Select.vue'

const options = [
  { label: '옵션 1', value: 'opt1' },
  { label: '옵션 2', value: 'opt2' },
  { label: '옵션 3 (비활성)', value: 'opt3', disabled: true },
  { label: '옵션 4', value: 'opt4' }
]

const meta: Meta<typeof Select> = {
  title: 'commons/목록선택(Select)',
  component: Select,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: { options, placeholder: '선택하세요' }
}

export const WithValue: Story = {
  args: { options, modelValue: 'opt2' }
}

export const Disabled: Story = {
  args: { options, disabled: true, placeholder: '비활성화' }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<Select v-model="value" :options="options" placeholder="선택하세요" />` } }
  },
  render: () => ({
    components: { Select },
    setup() {
      const value = ref<string | undefined>(undefined)
      return { value, options }
    },
    template: `
      <div class="space-y-2 w-48">
        <Select v-model="value" :options="options" placeholder="선택하세요" />
        <p class="text-gray-500">선택: {{ value || '없음' }}</p>
      </div>
    `
  })
}
