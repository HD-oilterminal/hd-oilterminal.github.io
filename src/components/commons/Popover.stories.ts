import type { Meta, StoryObj } from '@storybook/vue3'

import Popover from './Popover.vue'

const meta: Meta<typeof Popover> = {
  title: 'commons/말풍선-팝오버',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'select', options: ['start', 'center', 'end'] }
  }
}

export default meta
type Story = StoryObj<typeof Popover>

export const Default: Story = {
  render: () => ({
    components: { Popover },
    template: `
      <Popover>
        <template #trigger>
          <button class="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            팝오버 열기
          </button>
        </template>
        <div class="p-4 w-64">
          <p class="text-sm font-medium text-gray-900 mb-1">팝오버 제목</p>
          <p class="text-sm text-gray-500">여기에 팝오버 내용이 들어갑니다.</p>
        </div>
      </Popover>
    `
  })
}

export const TopAlign: Story = {
  render: () => ({
    components: { Popover },
    template: `
      <div class="flex justify-center pt-24">
        <Popover side="top">
          <template #trigger>
            <button class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 text-sm hover:bg-gray-50">위쪽으로</button>
          </template>
          <div class="p-4 w-48 text-sm text-gray-700">위에 뜨는 팝오버</div>
        </Popover>
      </div>
    `
  })
}
