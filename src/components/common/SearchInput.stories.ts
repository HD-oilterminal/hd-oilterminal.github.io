import type { Meta, StoryObj } from '@storybook/vue3'
import SearchInput from './SearchInput.vue'

const meta: Meta<typeof SearchInput> = {
  title: 'Common/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    modelValue: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof SearchInput>

export const Default: Story = {
  args: {
    placeholder: '그룹코드,코드명',
    modelValue: '',
  },
}

export const WithValue: Story = {
  args: {
    placeholder: '그룹코드,코드명',
    modelValue: 'MNU01',
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: '선박명, 선박코드 검색',
    modelValue: '',
  },
}
