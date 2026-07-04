import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

import Icon from './Icon.vue'

const meta: Meta<typeof Icon> = {
  title: 'commons/아이콘',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'number', min: 12, max: 96, step: 4 } },
    weight: { control: 'select', options: [100, 200, 300, 400, 500, 600, 700] }
  }
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: { name: 'search', size: 24 }
}

export const Filled: Story = {
  args: { name: 'delete', size: 24, filled: true }
}

const GALLERY = [
  // 툴바 / CRUD
  'search',
  'add',
  'add_circle',
  'save',
  'delete',
  'edit',
  'refresh',
  'close',
  'check',
  'filter_alt',
  'more_vert',
  'download',
  'upload',
  'print',
  // 내비게이션
  'home',
  'dashboard',
  'menu',
  'chevron_left',
  'chevron_right',
  'expand_more',
  'expand_less',
  'arrow_back',
  'open_in_new',
  'logout',
  // 도메인 (오일터미널)
  'local_shipping',
  'directions_boat',
  'oil_barrel',
  'propane_tank',
  'water_drop',
  'valve',
  'conveyor_belt',
  'warehouse',
  'scale',
  'schedule',
  'calendar_month',
  'event_note',
  // 시스템 / 사용자
  'person',
  'group',
  'badge',
  'settings',
  'admin_panel_settings',
  'key',
  'lock',
  'notifications',
  'mail',
  'sms',
  'description',
  'receipt_long',
  'request_quote',
  'fact_check',
  'history',
  'info',
  'warning',
  'error',
  'help'
]

/** 아이콘 이름을 클릭하면 클립보드에 복사됩니다. 전체 목록: https://fonts.google.com/icons */
export const Gallery: Story = {
  render: () => ({
    components: { Icon },
    setup() {
      const keyword = ref('')
      const copied = ref('')
      const copy = (name: string) => {
        navigator.clipboard.writeText(name)
        copied.value = name
      }
      return { GALLERY, keyword, copied, copy }
    },
    template: `
      <div class="space-y-4">
        <input
          v-model="keyword"
          placeholder="아이콘 이름 검색…"
          class="h-9 w-64 rounded border border-gray-300 px-3 text-sm"
        />
        <div class="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2">
          <button
            v-for="name in GALLERY.filter((n) => n.includes(keyword))"
            :key="name"
            type="button"
            class="flex cursor-pointer flex-col items-center gap-2 rounded border border-gray-200 p-3 hover:bg-gray-100"
            :title="name"
            @click="copy(name)"
          >
            <Icon :name="name" :size="28" />
            <span class="w-full truncate text-center text-sm" :class="copied === name ? 'text-blue-600' : 'text-gray-500'">
              {{ copied === name ? '복사됨!' : name }}
            </span>
          </button>
        </div>
        <p class="text-sm text-gray-400">
          아이콘을 클릭하면 이름이 복사됩니다. 전체 목록은
          <a href="https://fonts.google.com/icons" target="_blank" class="underline">fonts.google.com/icons</a> 참고.
        </p>
      </div>
    `
  })
}
