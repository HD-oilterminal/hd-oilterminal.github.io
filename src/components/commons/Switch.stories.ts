import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Switch from './Switch.vue'

const meta: Meta<typeof Switch> = {
  title: 'commons/스위치-버튼',
  component: Switch,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  args: { label: '알림', modelValue: false }
}

export const Checked: Story = {
  args: { label: '알림 켜짐', modelValue: true }
}

export const Disabled: Story = {
  args: { label: '비활성화', modelValue: false, disabled: true }
}

export const DisabledChecked: Story = {
  args: { label: '비활성화 (켜짐)', modelValue: true, disabled: true }
}

export const NoLabel: Story = {
  args: { modelValue: false }
}

export const Interactive: Story = {
  render: () => ({
    components: { Switch },
    setup() {
      const on = ref(false)
      return { on }
    },
    template: `<Switch v-model="on" :label="on ? '켜짐' : '꺼짐'" />`
  })
}
