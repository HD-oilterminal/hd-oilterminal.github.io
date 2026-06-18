import type { Meta, StoryObj } from '@storybook/vue3'
import type { RowObject } from 'realgrid'

import Checkbox from '../../components/commons/Checkbox.vue'
import Select from '../../components/commons/Select.vue'
import RealGrid from '../../components/grid/RealGrid.vue'
import InputFinder from './InputFinder.vue'

// sample data
const ROOMS = ['A', 'B', 'C', 'D']
const NAMES = '가나다라마바사아자차카타파하'.split('')
const ROWS = Array.from({ length: 21 }, (_, i) => ({
  name: NAMES[i % NAMES.length] + NAMES[(i + 1) % NAMES.length] + NAMES[(i + 2) % NAMES.length],
  age: `${i + 1}`,
  room: ROOMS[i % ROOMS.length],
  use: i % 2 === 0 ? 'Y' : 'N'
}))

const meta: Meta<typeof InputFinder> = {
  title: 'commons/입력-그리드검색',
  component: InputFinder,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof InputFinder>

export const Default: Story = {
  render: () => ({
    components: { InputFinder },
    setup() {
      const value = ref<RowObject>()
      return { value, ROWS }
    },
    template: `
      <div class="space-y-2">
        <InputFinder v-model="value" label="담당자" placeholder="검색..." size="350px" :grid="{
          columns: {
            name: { header: '이름', width: 120 },
            age: { header: '나이', width: 80 },
            room: { header: '호실', width: 80 }
          },
          searchColumn: 'name',
          rows: ROWS
        }" />
        <p class="text-sm text-gray-500">선택된 value(room): {{ value ?? '없음' }}</p>
      </div>
    `
  })
}

export const WithExpandableHead: Story = {
  name: '확장 검색(#head)',
  render: () => ({
    components: { InputFinder, RealGrid, Checkbox, Select },
    setup() {
      const value = ref<string>()
      const terms = reactive({ use: '-', room: { A: true, B: true, C: true } })

      return { value, terms, ROWS }
    },
    template: `
      <div class="space-y-2">
        <InputFinder v-model="value" label="방 배정" placeholder="검색..." size="350px" :grid="{
          columns: {
            name: { header: '이름', width: 120 },
            age: { header: '나이', width: 80 },
            room: { header: '호실', width: 80 }
          },
          searchColumn: 'name',
          rows: ROWS.filter(row => ['-', row.use].includes(terms.use) && terms.room[row.room])
        }">
          <template #head>
            <div class="flex items-center gap-2 text-sm">
              <b>Room</b>
              <Checkbox v-model="terms.room.A" label="A" />
              <Checkbox v-model="terms.room.B" label="B" />
              <Checkbox v-model="terms.room.C" label="C" />
              <label class="ml-4 shrink-0 flex items-center gap-2 w-30 whitespace-nowrap">
                <b>사용여부</b>
                <Select v-model="terms.use" :options="[ { label: '모두', value: '-' }, { label: '사용', value: 'Y' }, { label: '미사용', value: 'N' } ]" />
              </label>
            </div>
          </template>
        </InputFinder>
        <p class="text-sm text-gray-500">선택된 value(room): {{ value ?? '없음' }}</p>
      </div>
    `
  })
}
