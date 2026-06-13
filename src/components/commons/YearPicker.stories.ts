import type { Meta, StoryObj } from '@storybook/vue3'
import dayjs from 'dayjs'
import { ref } from 'vue'

import YearPicker from './YearPicker.vue'

const meta: Meta<typeof YearPicker> = {
  title: 'commons/달력-연도 입력',
  component: YearPicker,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' }
  },
  decorators: [() => ({ template: '<div style="min-height: 280px"><story /></div>' })]
}

export default meta
type Story = StoryObj<typeof YearPicker>

const thisYear = dayjs().format('YYYY')

export const Disabled: Story = {
  args: {
    modelValue: thisYear,
    disabled: false
  }
}

export const Interactive: Story = {
  render: () => ({
    components: { YearPicker },
    setup() {
      const year = ref<string>()
      return { year }
    },
    template: `
      <div class="space-y-4 p-4">
        <YearPicker v-model="year" />
        <p class="text-sm text-gray-600">
          선택된 연도: <span class="font-medium text-gray-900">{{ year ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
