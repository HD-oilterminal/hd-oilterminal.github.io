import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { parseDate } from '@internationalized/date'
import RangeCalendar from 'hdot-tmaster-front/components/commons/RangeCalendar.vue'

const meta: Meta<typeof RangeCalendar> = {
  title: 'commons/RangeCalendar',
  component: RangeCalendar,
  tags: ['autodocs'],
  argTypes: {
    numberOfMonths: { control: { type: 'number', min: 1, max: 3 } },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof RangeCalendar>

export const Default: Story = {
  args: {
    numberOfMonths: 2,
    disabled: false,
    readonly: false,
  },
}

export const WithSelectedRange: Story = {
  args: {
    modelValue: {
      start: parseDate('2026-05-10'),
      end: parseDate('2026-05-22'),
    },
    numberOfMonths: 2,
  },
}

export const SingleMonth: Story = {
  args: {
    numberOfMonths: 1,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    modelValue: {
      start: parseDate('2026-05-10'),
      end: parseDate('2026-05-22'),
    },
    numberOfMonths: 2,
  },
}

export const Interactive: Story = {
  render: () => ({
    components: { RangeCalendar },
    setup() {
      const range = ref<{ start?: string; end?: string }>({})
      function handleUpdate(v: { start?: { toString(): string }; end?: { toString(): string } }) {
        range.value = { start: v.start?.toString(), end: v.end?.toString() }
      }
      return { range, handleUpdate }
    },
    template: `
      <div class="space-y-4">
        <RangeCalendar
          class="rounded-md border border-gray-200 shadow-sm w-fit"
          @update:model-value="handleUpdate"
        />
        <p class="text-sm text-gray-600">
          시작: <span class="font-medium text-gray-900">{{ range.start ?? '없음' }}</span>
          &nbsp;~&nbsp;
          종료: <span class="font-medium text-gray-900">{{ range.end ?? '없음' }}</span>
        </p>
      </div>
    `,
  }),
}
