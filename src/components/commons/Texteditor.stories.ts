import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Texteditor from './Texteditor.vue'

const meta: Meta<typeof Texteditor> = {
  title: 'commons/텍스트에디터',
  component: Texteditor,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'text' }
  },
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { Texteditor },
      setup() {
        return { args, updateArgs }
      },
      template: `<Texteditor v-bind="args" @update:model-value="updateArgs({ modelValue: $event })" />`
    }
  }
}

export default meta
type Story = StoryObj<typeof Texteditor>

export const Default: Story = {
  args: { modelValue: '' }
}

export const WithContent: Story = {
  args: {
    modelValue:
      '<p><strong>굵은 텍스트</strong>와 <span style="color: rgb(230, 0, 0);">색상 텍스트</span></p><ol><li>첫 번째</li><li>두 번째</li></ol>'
  }
}

export const Required: Story = {
  args: { modelValue: '', required: true }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<Texteditor v-model="content" />` } }
  },
  render: () => ({
    components: { Texteditor },
    setup() {
      const content = ref('')
      return { content }
    },
    template: `
      <div class="space-y-2">
        <Texteditor v-model="content" />
        <pre class="rounded bg-gray-100 p-2 text-xs whitespace-pre-wrap">{{ content }}</pre>
      </div>
    `
  })
}
