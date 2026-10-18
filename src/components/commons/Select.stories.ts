import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'

import Select from './Select.vue'

const options = [
  { label: '옵션 1', value: 'opt1' },
  { label: '옵션 2', value: 'opt2' },
  { label: '옵션 3 (비활성)', value: 'opt3', disabled: true },
  { label: '옵션 4', value: 'opt4' }
]

const meta: Meta<typeof Select> = {
  title: 'commons/목록선택(Select)',
  component: Select,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: { options }
}

export const WithValue: Story = {
  args: { options, modelValue: 'opt2' }
}

export const Disabled: Story = {
  args: { options, disabled: true }
}

export const Required: Story = {
  parameters: {
    docs: { source: { code: `<Select v-model="value" :options="options" required />` } }
  },
  render: () => ({
    components: { Select },
    setup() {
      const value = ref<string | undefined>(undefined)
      return { value, options }
    },
    template: `
      <div class="space-y-2 w-48">
        <Select v-model="value" :options="options" label="대상" required />
        <p class="text-gray-500">선택: {{ value || '없음' }}</p>
      </div>
    `
  })
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<Select v-model="value" :options="options" />` } }
  },
  render: () => ({
    components: { Select },
    setup() {
      const value = ref<string | undefined>(undefined)
      return { value, options }
    },
    template: `
      <div class="space-y-2 w-48">
        <Select v-model="value" :options="options" label="대상" />
        <p class="text-gray-500">선택: {{ value || '없음' }}</p>
      </div>
    `
  })
}

const longOptions = [
  {
    label:
      '울산1: 2026-10-17 09:00 입항 예정, 화물 HSFO 380 / 적하 12,000 MT, 선적 대기 중, 하역사 담당자 사전 협의 필요, 선석 점유 예상 시간 18시간 이상, 세관 검사 대상 여부 확인 요망',
    value: 'long1'
  },
  {
    label:
      '울산2: 2026-10-18 14:30 접안 예정, 화물 MGO / 양하 8,500 MT, 탱크 TK-204 배정, 품질 검사 샘플링 완료 후 하역 개시, 야간 작업 승인 필요, 기상 악화 시 일정 변동 가능',
    value: 'long2'
  },
  {
    label:
      '평택: 2026-10-19 06:00 이안 예정, 화물 LSFO 0.5% / 적하 15,200 MT, 선적 완료 후 검량 서류 제출 대기, 도선사 배정 확인 요망, 예인선 2척 사전 수배 완료, 출항 전 안전 점검 필수',
    value: 'long3',
    disabled: true
  }
]

export const LongOptions: Story = {
  name: '긴 옵션 텍스트',
  parameters: {
    docs: { source: { code: `<Select v-model="value" :options="longOptions" label="선석" />` } }
  },
  render: () => ({
    components: { Select },
    setup() {
      const value = ref<string | undefined>(undefined)
      return { value, longOptions }
    },
    template: `
      <div class="space-y-2 w-80">
        <p class="text-xs text-gray-400">옵션 라벨이 길 경우 선택 영역과 드롭다운의 말줄임/줄바꿈 처리 확인</p>
        <Select v-model="value" :options="longOptions" label="선석" class="w-150" />
        <p class="text-gray-500">선택: {{ value || '없음' }}</p>
      </div>
    `
  })
}
