import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Input from './Input.vue'

const meta: Meta<typeof Input> = {
  title: 'commons/입력',
  component: Input,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  parameters: {
    docs: { source: { code: `<Input v-model="value" placeholder="입력하세요" />` } }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="space-y-2">
        <Input v-model="value" placeholder="입력하세요" />
        <p class="text-xs text-gray-400">입력값: {{ value || '없음' }}</p>
      </div>
    `
  })
}

export const WithLabel: Story = {
  name: '라벨',
  parameters: {
    docs: { source: { code: `<Input v-model="value" label="이름" placeholder="홍길동" />` } }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Input v-model="value" label="이름" placeholder="홍길동" />`
  })
}

export const WithPrefixSuffix: Story = {
  name: 'Prefix / Suffix',
  parameters: {
    docs: {
      source: {
        code: `<Input v-model="value" type="number" label="가격" prefix="₩" suffix="원" />`
      }
    }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref<number>()
      return { value }
    },
    template: `
      <div class="space-y-2">
        <Input v-model="value" type="number" label="가격" prefix="₩" suffix="원" placeholder="0" />
        <p class="text-xs text-gray-400">입력값: {{ value ?? '없음' }}</p>
      </div>
    `
  })
}

export const NumberType: Story = {
  name: '숫자 입력',
  parameters: {
    docs: {
      source: { code: `<Input v-model="value" type="number" label="수량" suffix="개" />` }
    }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref<number>(1234567.89)
      return { value }
    },
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-400">-를 먼저 입력하면 음수 지원, 소수점 입력 가능</p>
        <Input v-model="value" type="number" label="수량" suffix="개" />
        <p class="text-xs text-gray-400">입력값: {{ value ?? '없음' }}</p>
      </div>
    `
  })
}

export const Required: Story = {
  name: '필수 입력',
  parameters: {
    docs: {
      source: { code: `<Input v-model="value" label="이메일" required placeholder="example@mail.com" />` }
    }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `<Input v-model="value" label="이메일" required placeholder="example@mail.com" />`
  })
}

export const TelType: Story = {
  name: '전화번호 입력',
  parameters: {
    docs: {
      source: { code: `<Input v-model="value" type="tel" label="전화번호" placeholder="010-1234-5678" />` }
    }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div class="space-y-2">
        <p class="text-xs text-gray-400">숫자와 하이픈만 입력 가능, 유효하지 않은 형식이면 빨간 테두리</p>
        <Input v-model="value" type="tel" label="전화번호" placeholder="010-1234-5678" />
        <p class="text-xs text-gray-400">입력값: {{ value || '없음' }}</p>
      </div>
    `
  })
}

export const Disabled: Story = {
  name: '비활성화',
  parameters: {
    docs: {
      source: { code: `<Input v-model="value" label="가격" type="number" suffix="원" disabled />` }
    }
  },
  render: () => ({
    components: { Input },
    setup() {
      const value = ref(99000)
      return { value }
    },
    template: `<Input v-model="value" label="가격" type="number" suffix="원" disabled />`
  })
}
