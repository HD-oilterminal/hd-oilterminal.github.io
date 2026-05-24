import type { Meta, StoryObj } from '@storybook/vue3'

import Label from './Label.vue'

const meta: Meta<typeof Label> = {
  title: 'commons/라벨링(Label)',
  component: Label,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  render: () => ({
    components: { Label },
    template: `<Label>이름</Label>`
  })
}

export const Required: Story = {
  render: () => ({
    components: { Label },
    template: `<Label required>이메일</Label>`
  })
}

export const Disabled: Story = {
  render: () => ({
    components: { Label },
    template: `<Label disabled>비활성화</Label>`
  })
}

export const WithInput: Story = {
  render: () => ({
    components: { Label },
    template: `
      <div class="flex flex-col gap-1.5">
        <Label for="name" required>이름</Label>
        <input id="name" type="text" class="h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="홍길동" />
      </div>
    `
  })
}
