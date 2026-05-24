import type { Meta, StoryObj } from '@storybook/vue3'
import dayjs from 'dayjs'
import { ref } from 'vue'

import DatePicker from './DatePicker.vue'

const meta: Meta<typeof DatePicker> = {
  title: 'commons/날짜입력-달력',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['date', 'month', 'year']
    },
    format: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    locale: {
      control: 'select',
      options: ['ko', 'en', 'ja', 'zh-CN'],
      description: '언어설정'
    }
  }
}

export default meta
type Story = StoryObj<typeof DatePicker>

const today = dayjs(Date.now()).format('YYYY-MM-DD')

export const Default: Story = {
  args: {
    placeholder: '날짜 선택',
    modelValue: today,
    disabled: false
  }
}

export const MonthMode: Story = {
  args: {
    type: 'month',
    placeholder: '월 선택',
    modelValue: today
  }
}

export const YearMode: Story = {
  args: {
    type: 'year',
    placeholder: '연도 선택',
    modelValue: today
  }
}

export const WithValue: Story = {
  args: {
    modelValue: today
  }
}

export const CustomFormat: Story = {
  args: {
    modelValue: today,
    format: 'YYYY년 MM월 DD일'
  }
}

export const CustomPlaceholder: Story = {
  args: {
    modelValue: today,
    placeholder: '기준일을 선택하세요'
  }
}

export const Disabled: Story = {
  args: {
    modelValue: today,
    disabled: true
  }
}

export const Interactive: Story = {
  render: () => ({
    components: { DatePicker },
    setup() {
      const date = ref<string>()
      return { date }
    },
    template: `
      <div class="space-y-4 p-4">
        <DatePicker v-model="date" placeholder="날짜를 선택하세요" />
        <p class="text-sm text-gray-600">
          선택된 날짜: <span class="font-medium text-gray-900">{{ date ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
