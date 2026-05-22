import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { parseDate } from '@internationalized/date'
import Calendar from 'hdot-tmaster-front/components/commons/Calendar.vue'

const meta: Meta<typeof Calendar> = {
  title: 'commons/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  args: {
    disabled: false,
    readonly: false,
  },
}

export const WithSelectedDate: Story = {
  args: {
    modelValue: parseDate('2026-05-22'),
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: parseDate('2026-05-22'),
  },
}

export const Readonly: Story = {
  args: {
    readonly: true,
    modelValue: parseDate('2026-05-22'),
  },
}

export const Interactive: Story = {
  render: () => ({
    components: { Calendar },
    setup() {
      const selected = ref<string>()
      return { selected }
    },
    template: `
      <div class="space-y-4">
        <Calendar
          :model-value="selected ? undefined : undefined"
          class="rounded-md border border-gray-200 shadow-sm w-fit"
          @update:model-value="v => selected = v?.toString()"
        />
        <p class="text-sm text-gray-600">
          선택된 날짜: <span class="font-medium text-gray-900">{{ selected ?? '없음' }}</span>
        </p>
      </div>
    `,
  }),
}
