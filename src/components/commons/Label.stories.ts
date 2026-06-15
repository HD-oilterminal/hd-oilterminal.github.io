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
  parameters: {
    docs: { source: { code: `<Label>이름</Label>` } }
  },
  render: () => ({
    components: { Label },
    template: `<Label>이름</Label>`
  })
}

export const Required: Story = {
  parameters: {
    docs: { source: { code: `<Label required>이메일</Label>` } }
  },
  render: () => ({
    components: { Label },
    template: `<Label required>이메일</Label>`
  })
}

export const WithInput: Story = {
  parameters: {
    docs: {
      source: {
        code: `<div class="flex flex-col gap-1.5">
  <Label required text="이름">
    <input type="text" placeholder="홍길동" />
  </Label>
</div>`
      }
    }
  },
  render: () => ({
    components: { Label },
    template: `
      <div class="flex flex-col gap-1.5">
        <Label required text="이름"><input type="text" placeholder="홍길동" /></Label>
      </div>
    `
  })
}
