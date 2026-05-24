import type { Meta, StoryObj } from '@storybook/vue3'
import dayjs from 'dayjs'
import { ref } from 'vue'

import DateRangePicker from './DateRangePicker.vue'

const meta: Meta<typeof DateRangePicker> = {
  title: 'commons/기간입력-달력',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    format: { control: 'text' },
    disabled: { control: 'boolean' },
    locale: {
      control: 'select',
      options: ['ko', 'en', 'ja', 'zh-CN']
    }
  }
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

const start = dayjs(Date.now()).format('YYYY-MM-DD')
const end = dayjs(Date.now()).add(3, 'day').format('YYYY-MM-DD')

export const Default: Story = {
  args: {
    placeholder: '기간 선택',
    disabled: false
  }
}

export const WithValue: Story = {
  args: {
    modelValue: {
      start,
      end
    }
  }
}

export const SingleCalendar: Story = {
  name: '기간선택 (달력 1면)',
  args: {
    placeholder: '기간 선택(달력 1면)'
  }
}

export const Disabled: Story = {
  name: '비활성화',
  args: {
    modelValue: {
      start,
      end
    },
    disabled: true
  }
}

export const Interactive: Story = {
  name: '데이터 반응성 바인딩',
  render: () => ({
    components: { DateRangePicker },
    setup() {
      const range = ref<{ start?: string; end?: string }>({})
      return { range }
    },
    template: `
      <div class="space-y-4 p-4">
        <DateRangePicker v-model="range" placeholder="기간 선택" />
        <p class="text-sm text-gray-600">
          시작: <span class="font-medium text-gray-900">{{ range.start ?? '없음' }}</span>
          &nbsp;~&nbsp;
          종료: <span class="font-medium text-gray-900">{{ range.end ?? '없음' }}</span>
        </p>
      </div>
    `
  })
}
