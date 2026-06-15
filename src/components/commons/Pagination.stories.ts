import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Pagination from './Pagination.vue'

const meta: Meta<typeof Pagination> = {
  title: 'commons/페이지매김',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'number' },
    total: { control: 'number' },
    itemsPerPage: { control: 'number' }
  }
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  args: { modelValue: 1, total: 100, itemsPerPage: 10 }
}

export const MiddlePage: Story = {
  args: { modelValue: 5, total: 100, itemsPerPage: 10 }
}

export const LastPage: Story = {
  args: { modelValue: 10, total: 100, itemsPerPage: 10 }
}

export const FewPages: Story = {
  args: { modelValue: 2, total: 30, itemsPerPage: 10 }
}

export const Interactive: Story = {
  parameters: {
    docs: { source: { code: `<Pagination v-model="page" :total="200" :items-per-page="10" />` } }
  },
  render: () => ({
    components: { Pagination },
    setup() {
      const page = ref(1)
      return { page }
    },
    template: `
      <div class="space-y-3">
        <Pagination v-model="page" :total="200" :items-per-page="10" />
        <p class="text-sm text-gray-500">현재 페이지: {{ page }}</p>
      </div>
    `
  })
}
