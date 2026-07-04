import type { Meta, StoryObj } from '@storybook/vue3'

import Tooltip from './Tooltip.vue'

const meta: Meta<typeof Tooltip> = {
  title: 'commons/말풍선(Tooltip)',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] }
  }
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: args => ({
    components: { Tooltip },
    setup() {
      return { args }
    },
    template: `
      <div class="flex justify-center pt-12">
        <Tooltip v-bind="args">
          <button class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-50">
            마우스를 올려보세요
          </button>
        </Tooltip>
      </div>
    `
  }),
  args: {
    content: '도움말 텍스트입니다'
  },
  parameters: {
    docs: {
      source: {
        code: `
<Tooltip content="도움말 텍스트입니다">
  <button class="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 hover:bg-gray-50">
    마우스를 올려보세요
  </button>
</Tooltip>`.trim()
      }
    }
  }
}

export const Sides: Story = {
  render: () => ({
    components: { Tooltip },
    template: `
      <div class="flex justify-center gap-4 py-16">
        <Tooltip content="위쪽" side="top">
          <button class="h-9 rounded-md border border-gray-300 px-3 hover:bg-gray-50">위</button>
        </Tooltip>
        <Tooltip content="오른쪽" side="right">
          <button class="h-9 rounded-md border border-gray-300 px-3 hover:bg-gray-50">오른쪽</button>
        </Tooltip>
        <Tooltip content="아래쪽" side="bottom">
          <button class="h-9 rounded-md border border-gray-300 px-3 hover:bg-gray-50">아래</button>
        </Tooltip>
        <Tooltip content="왼쪽" side="left">
          <button class="h-9 rounded-md border border-gray-300 px-3 hover:bg-gray-50">왼쪽</button>
        </Tooltip>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `
<Tooltip content="위쪽" side="top"><button>위</button></Tooltip>
<Tooltip content="오른쪽" side="right"><button>오른쪽</button></Tooltip>
<Tooltip content="아래쪽" side="bottom"><button>아래</button></Tooltip>
<Tooltip content="왼쪽" side="left"><button>왼쪽</button></Tooltip>`.trim()
      }
    }
  }
}

export const CustomContent: Story = {
  render: () => ({
    components: { Tooltip },
    template: `
      <div class="flex justify-center pt-12">
        <Tooltip side="bottom">
          <template #content>
            <div class="text-xs">
              <p class="font-medium">상세 정보</p>
              <p class="mt-0.5 text-gray-300">슬롯으로 커스텀 내용 삽입</p>
            </div>
          </template>
          <button class="h-9 rounded-md border border-gray-300 px-3 hover:bg-gray-50">커스텀 툴팁</button>
        </Tooltip>
      </div>
    `
  }),
  parameters: {
    docs: {
      source: {
        code: `
<Tooltip side="bottom">
  <template #content>
    <div class="text-xs">
      <p class="font-medium">상세 정보</p>
      <p class="mt-0.5 text-gray-300">슬롯으로 커스텀 내용 삽입</p>
    </div>
  </template>
  <button class="h-9 rounded-md border border-gray-300 px-3 hover:bg-gray-50">
    커스텀 툴팁
  </button>
</Tooltip>`.trim()
      }
    }
  }
}
