import type { Meta, StoryObj } from '@storybook/vue3'
import dayjs from 'dayjs'
import { ref } from 'vue'

import MonthPicker from './MonthPicker.vue'

const meta: Meta<typeof MonthPicker> = {
  title: 'commons/달력-월 입력',
  component: MonthPicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' }
  },
  decorators: [() => ({ template: '<div style="min-height: 300px"><story /></div>' })]
}

export default meta
type Story = StoryObj<typeof MonthPicker>

const thisMonth = dayjs().format('YYYY-MM')

export const Default: Story = {
  args: { modelValue: thisMonth }
}

export const Disabled: Story = {
  args: { modelValue: thisMonth, disabled: true }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<MonthPicker v-model="month" />` } }
  },
  render: () => ({
    components: { MonthPicker },
    setup() {
      const month = ref<string>()
      return { month }
    },
    template: `
      <div class="space-y-4 p-4">
        <MonthPicker v-model="month" />
        <p class="text-gray-600">
          선택된 연월: <span class="font-medium text-gray-900">{{ month ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
