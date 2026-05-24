import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Autocomplete from './Autocomplete.vue'

const options = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '인천', value: 'incheon' },
  { label: '대구', value: 'daegu' },
  { label: '대전', value: 'daejeon' },
  { label: '광주', value: 'gwangju' },
  { label: '울산', value: 'ulsan' },
]

const meta: Meta<typeof Autocomplete> = {
  title: 'commons/입력-자동완성',
  component: Autocomplete,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Autocomplete>

export const Default: Story = {
  args: { options, placeholder: '도시 검색...' },
}

export const WithValue: Story = {
  args: { options, modelValue: 'busan', placeholder: '도시 검색...' },
}

export const Disabled: Story = {
  args: { options, disabled: true, placeholder: '비활성화' },
}

export const Interactive: Story = {
  render: () => ({
    components: { Autocomplete },
    setup() {
      const value = ref<string>()
      return { value, options }
    },
    template: `
      <div class="space-y-2">
        <Autocomplete v-model="value" :options="options" placeholder="도시 검색..." class="w-64" />
        <p class="text-sm text-gray-500">선택: {{ value ?? '없음' }}</p>
      </div>
    `,
  }),
}
