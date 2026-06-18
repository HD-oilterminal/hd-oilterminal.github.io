import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Tabs from './Tabs.vue'

const tabs = [
  { value: 'overview', label: '개요' },
  { value: 'details', label: '상세' },
  { value: 'history', label: '이력' },
  { value: 'settings', label: '설정', disabled: true }
]

const tabsWithCount = [
  { value: 'work', label: '오늘의 작업', count: 0 },
  { value: 'req', label: '오더요청', count: 3 },
  { value: 'doc', label: '서류완료대기', count: 12 },
  { value: 'vetting', label: '선박베팅 요청' }
]

const meta: Meta<typeof Tabs> = {
  title: 'Layout/탭',
  component: Tabs,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Tabs>

export const WithCount: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs v-model="active" :tabs="tabs">
  <template #work>오늘의 작업 내용</template>
  <template #req>오더요청 내용</template>
  <template #doc>서류완료대기 내용</template>
  <template #vetting>선박베팅 요청 내용</template>
</Tabs>`
      }
    }
  },
  render: () => ({
    components: { Tabs },
    setup() {
      const active = ref('req')
      return { active, tabs: tabsWithCount }
    },
    template: `
      <Tabs v-model="active" :tabs="tabs">
        <template #work><p class="text-sm text-gray-700">오늘의 작업 내용입니다.</p></template>
        <template #req><p class="text-sm text-gray-700">오더요청 내용입니다.</p></template>
        <template #doc><p class="text-sm text-gray-700">서류완료대기 내용입니다.</p></template>
        <template #vetting><p class="text-sm text-gray-700">선박베팅 요청 내용입니다.</p></template>
      </Tabs>
    `
  })
}

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `<Tabs v-model="active" :tabs="tabs">
  <template #overview>개요 탭 내용입니다.</template>
  <template #details>상세 탭 내용입니다.</template>
  <template #history>이력 탭 내용입니다.</template>
  <template #settings>설정 탭 내용입니다.</template>
</Tabs>`
      }
    }
  },
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
    `
  })
}
