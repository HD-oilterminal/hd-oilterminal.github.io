import type { Meta, StoryObj } from '@storybook/vue3'
import dayjs from 'dayjs'
import { ref } from 'vue'

import DateTimePicker from './DateTimePicker.vue'

const meta: Meta<typeof DateTimePicker> = {
  title: 'commons/달력-날짜시간 입력',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' }
  },
  decorators: [() => ({ template: '<div style="min-height: 350px"><story /></div>' })]
}

export default meta
type Story = StoryObj<typeof DateTimePicker>

const now = dayjs().format('YYYY-MM-DD HH:mm')

export const Default: Story = {
  args: { modelValue: now }
}

export const Disabled: Story = {
  args: { modelValue: now, disabled: true }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<DateTimePicker v-model="datetime" />` } }
  },
  render: () => ({
    components: { DateTimePicker },
    setup() {
      const datetime = ref<string>()
      return { datetime }
    },
    template: `
      <div class="space-y-4 p-4">
        <DateTimePicker v-model="datetime" />
        <p class="text-gray-600">
          선택된 날짜시간: <span class="font-medium text-gray-900">{{ datetime ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
