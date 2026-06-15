import { useArgs } from '@storybook/preview-api'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Checkbox from './Checkbox.vue'

const meta: Meta<typeof Checkbox> = {
  title: 'commons/체크박스',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'boolean' }
  },
  render: args => {
    const [, updateArgs] = useArgs()
    return {
      components: { Checkbox },
      setup() {
        return { args, updateArgs }
      },
      template: `<Checkbox v-bind="args" @update:model-value="updateArgs({ modelValue: $event })" />`
    }
  }
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { label: '체크박스', modelValue: false }
}

export const Checked: Story = {
  args: { label: '선택됨', modelValue: true }
}

export const Indeterminate: Story = {
  args: { label: '부분 선택', modelValue: 'indeterminate' }
}

export const Disabled: Story = {
  args: { label: '비활성화', modelValue: false, disabled: true }
}

export const DisabledChecked: Story = {
  args: { label: '비활성화 (선택됨)', modelValue: true, disabled: true }
}

export const NoLabel: Story = {
  args: { modelValue: false }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<Checkbox v-model="checked" :label="checked ? '선택됨' : '선택 안됨'" />` } }
  },
  render: () => ({
    components: { Checkbox },
    setup() {
      const checked = ref(false)
      return { checked }
    },
    template: `<Checkbox v-model="checked" :label="checked ? '선택됨' : '선택 안됨'" />`
  })
}
