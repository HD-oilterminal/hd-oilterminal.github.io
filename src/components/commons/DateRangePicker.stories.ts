import type { Meta, StoryObj } from '@storybook/vue3-vite'
import dayjs from 'dayjs'
import { ref } from 'vue'

import DateRangePicker from './DateRangePicker.vue'

const meta: Meta<typeof DateRangePicker> = {
  title: 'commons/달력-기간 입력',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' }
  },
  decorators: [() => ({ template: '<div style="min-height: 350px"><story /></div>' })]
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

const today = dayjs(Date.now()).format('YYYY-MM-DD')
const weekAgo = dayjs(Date.now()).subtract(7, 'day').format('YYYY-MM-DD')

export const Default: Story = {
  args: { start: weekAgo, end: today }
}

export const Disabled: Story = {
  args: { start: weekAgo, end: today, disabled: true }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<DateRangePicker v-model:start="start" v-model:end="end" />` } }
  },
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const start = ref<string>()
      const end = ref<string>()
      return { start, end }
    },
    template: `
      <div class="space-y-4 p-4">
        <DateRangePicker v-model:start="start" v-model:end="end" />
        <p class="text-gray-600">
          선택된 기간: <span class="font-medium text-gray-900">{{ start || '없음' }} ~ {{ end || '없음' }}</span>
        </p>
      </div>
    `
  })
}
