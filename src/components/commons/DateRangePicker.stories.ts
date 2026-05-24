import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DateRangePicker, { DateRange } from 'hdot-tmaster-front/components/commons/DateRangePicker.vue'

const meta: Meta<typeof DateRangePicker> = {
  title: 'commons/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    format: { control: 'text' },
    numberOfMonths: { control: { type: 'number', min: 1, max: 3 } },
    disabled: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['date', 'month', 'year'],
    },
    locale: {
      control: 'select',
      options: ['ko', 'en-US', 'ja', 'zh-CN'],
    }
  }
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {
  args: {
    placeholder: '날짜 범위 선택',
    numberOfMonths: 2,
    disabled: false
  }
}

export const MonthRange: Story = {
  args: {
    type: 'month',
    placeholder: '월 범위 선택',
  }
}

export const YearRange: Story = {
  args: {
    type: 'year',
    placeholder: '연도 범위 선택',
  }
}

export const WithValue: Story = {
  args: {
    modelValue: {
      start: '2026-05-01',
      end: '2026-05-22'
    }
  }
}

export const CustomFormat: Story = {
  args: {
    modelValue: {
      start: '2026-05-01',
      end: '2026-05-22'
    },
    format: 'YYYY/MM/DD'
  }
}

export const SingleMonth: Story = {
  args: {
    numberOfMonths: 1,
    placeholder: '날짜 범위 선택'
  }
}

export const Disabled: Story = {
  args: {
    modelValue: {
      start: '2026-05-01',
      end: '2026-05-22'
    },
    disabled: true
  }
}

export const Interactive: Story = {
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const range = ref<DateRange>({})
      return { range }
    },
    template: `
      <div class="space-y-4 p-4">
        <DateRangePicker v-model="range" placeholder="기간을 선택하세요" />
        <p class="text-sm text-gray-600">
          시작: <span class="font-medium text-gray-900">{{ range.start ?? '없음' }}</span>
          &nbsp;~&nbsp;
          종료: <span class="font-medium text-gray-900">{{ range.end ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
