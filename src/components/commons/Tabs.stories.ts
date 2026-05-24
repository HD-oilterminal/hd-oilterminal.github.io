import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Tabs from './Tabs.vue'

const tabs = [
  { value: 'overview', label: '개요' },
  { value: 'details', label: '상세' },
  { value: 'history', label: '이력' },
  { value: 'settings', label: '설정', disabled: true },
]

const meta: Meta<typeof Tabs> = {
  title: 'commons/탭-화면',
  component: Tabs,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => ({
    components: { Tabs },
    setup() {
      const active = ref('overview')
      return { active, tabs }
    },
    template: `
      <Tabs v-model="active" :tabs="tabs">
        <template #overview><p class="text-sm text-gray-700">개요 탭 내용입니다.</p></template>
        <template #details><p class="text-sm text-gray-700">상세 탭 내용입니다.</p></template>
        <template #history><p class="text-sm text-gray-700">이력 탭 내용입니다.</p></template>
        <template #settings><p class="text-sm text-gray-700">설정 탭 내용입니다.</p></template>
      </Tabs>
    `,
  }),
}
