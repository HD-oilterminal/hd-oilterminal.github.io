import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DatePicker from 'hdot-tmaster-front/components/commons/DatePicker.vue'
import dayjs from 'dayjs'

const meta: Meta<typeof DatePicker> = {
  title: 'commons/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' },
    placeholder: { control: 'text' },
    format: { control: 'text' },
    disabled: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  args: {
    placeholder: '날짜 선택',
    disabled: false
  }
}

export const WithValue: Story = {
  args: {
    modelValue: dayjs(Date.now()).format('YYYY-MM-DD')
  }
}

export const CustomFormat: Story = {
  args: {
    modelValue: dayjs(Date.now()).format('YYYY-MM-DD'),
    format: 'YYYY년 MM월 DD일'
  }
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: '기준일을 선택하세요'
  }
}

export const Disabled: Story = {
  args: {
    modelValue: dayjs(Date.now()).format('YYYY-MM-DD'),
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
