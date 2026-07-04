import type { Meta, StoryObj } from '@storybook/vue3'
import dayjs from 'dayjs'
import { ref } from 'vue'

import DatePicker from './DatePicker.vue'

const meta: Meta<typeof DatePicker> = {
  title: 'commons/달력-날짜 입력',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' }
  },
  decorators: [() => ({ template: '<div style="min-height: 350px"><story /></div>' })]
}

export default meta
type Story = StoryObj<typeof DatePicker>

const today = dayjs(Date.now()).format('YYYY-MM-DD')

export const Default: Story = {
  args: { modelValue: today }
}

export const Disabled: Story = {
  args: { modelValue: today, disabled: true }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<DatePicker v-model="date" />` } }
  },
  render: () => ({
    components: { DatePicker },
    setup() {
      const date = ref<string>()
      return { date }
    },
    template: `
      <div class="space-y-4 p-4">
        <DatePicker v-model="date" />
        <p class="text-gray-600">
          선택된 날짜: <span class="font-medium text-gray-900">{{ date ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
