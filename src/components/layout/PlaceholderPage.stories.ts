import type { Meta, StoryObj } from '@storybook/vue3'

import PlaceholderPage from './PlaceholderPage.vue'

const meta: Meta<typeof PlaceholderPage> = {
  title: 'layout/PlaceholderPage',
  component: PlaceholderPage,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof PlaceholderPage>

export const Default: Story = {}

export const WithTitle: Story = {
  args: { title: '재고 현황' }
}
