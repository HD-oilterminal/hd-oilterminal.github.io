import type { Meta, StoryObj } from '@storybook/vue3'
import { ValueType } from 'realgrid'
import { ref } from 'vue'

import { useGridExcel } from '../../composables/useRealGrid'
import { codeSystem } from '../../stores/codeSystem'
import { Columns } from '../../types/core'
import rows from './ReadGrid.data.json'
import RealGrid from './RealGrid.vue'

const meta: Meta<typeof RealGrid> = {
  title: 'grid/RealGrid',
  component: RealGrid,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'text' },
    editable: { control: 'boolean' }
  },
  decorators: [
    story => {
      // 스토리 전용 공통코드 (실제 앱에서는 API 응답을 codeSystem().load 로 주입)
      codeSystem().load({
        ALBUM: [
          { key: 'KARMA', name: '카르마', english: 'k-a-r-m-a' },
          { key: 'Around', name: '어라운드', english: 'a-r-o-u-n-d' },
          { key: 'Swanson', name: '스완쓴', english: 's-w-a-n-s-o-n' },
          { key: 'BTS', name: '윙즈', english: 'b-t-s' }
        ]
      })
      return { components: { story }, template: '<story />' }
    }
  ]
}

export default meta
type Story = StoryObj<typeof RealGrid>

const columns: Columns = {
  artist: { header: '아티스트', width: 120 },
  title: { header: '곡명', width: 180 },
  album: { header: '앨범', width: 160, code: 'ALBUM', align: 'center' },
  plays: { header: '재생수', width: 90, type: ValueType.NUMBER }
}

export const Default: Story = {
  args: {
    title: '테스트 리얼그리드',
    columns,
    rows,
    height: '300px',
    editable: true,
    fixed: {
      row: 1
    }
  }
}

export const Pageable: Story = {
  name: '서버사이드 페이지네이션',
  parameters: {
    docs: {
      source: {
        code: `<script setup lang="ts">
const size = 20
const rows = ref()

const load = async (page) => {
  await fetch('/api/oper/work_order/list', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ page, size })
  })
    .then(({content}) => (rows.value = content))
}

onMounted(() => load(1))
</script>

<template>
  <RealGrid title="샘플 그리드" :columns="columns" :rows="rows" height="300px" @paging="load" />
</template>`
      }
    }
  },
  render: () => ({
    components: { RealGrid },
    setup() {
      const SIZE = 20
      const TOTAL_PAGE = 221

      const fakeServer = (page: number) => ({
        count: SIZE,
        total_page: TOTAL_PAGE,
        page,
        list: Array.from({ length: SIZE }, (_, i) => {
          const n = (page - 1) * SIZE + i + 1
          return { artist: `아티스트 ${n}`, title: `곡명 ${n}`, album: 'ALBUM01', plays: n * 10 }
        })
      })

      const rows = ref(fakeServer(1))

      const load = (page: number) => {
        rows.value = fakeServer(page)
      }

      return { columns, rows, load }
    },
    template: `
      <RealGrid title="뻥튀기 데이터 그리드" :columns="columns" :rows="rows" height="300px" @paging="load" />
    `
  })
}

export const Groupable: Story = {
  name: '통계형(그룹핑)',
  parameters: {
    docs: {
      source: {
        code: `<RealGrid
  title="입출고현황"
  :groupable="true"
  :columns="columns"
  :rows="rows"
  height="400px"
/>`
      }
    }
  },
  render: () => ({
    components: { RealGrid },
    setup() {
      const groupColumns: Columns = {
        genre: { header: '장르', width: 100 },
        artist: { header: '아티스트', width: 120 },
        title: { header: '곡명', width: 180 },
        album: { header: '앨범', width: 160 },
        plays: { header: '재생수', width: 100, type: ValueType.NUMBER }
      }

      const groupRows = [
        { genre: 'R&B', artist: 'BIG Naughty', title: '그래서 나는 없다', album: 'KARMA', plays: 4820000 },
        { genre: 'R&B', artist: 'BIG Naughty', title: '서울 어딘가에', album: 'KARMA', plays: 3100000 },
        { genre: 'R&B', artist: 'Loco', title: '주말이 지나면', album: 'Around', plays: 3150000 },
        { genre: 'R&B', artist: 'Loco', title: 'Thinking About You', album: 'Around', plays: 2800000 },
        { genre: 'Hiphop', artist: 'Hash Swan', title: 'Hype Boy', album: 'Swanson', plays: 2740000 },
        { genre: 'Hiphop', artist: 'Hash Swan', title: 'Petal', album: 'Swanson', plays: 1950000 },
        { genre: 'Hiphop', artist: 'BIG Naughty', title: 'Karma', album: 'KARMA', plays: 2200000 },
        { genre: 'Pop', artist: 'Loco', title: 'Mountains', album: 'Solo', plays: 1600000 }
      ]

      return { groupColumns, groupRows }
    },
    template: `
      <div class="flex flex-col gap-2 text-gray-500">
        <p>컬럼 헤더를 상단 그룹핑 영역으로 드래그하면 해당 컬럼으로 그룹핑됩니다.</p>
        <RealGrid title="장르별 재생통계" :groupable="true" :columns="groupColumns" :rows="groupRows" height="400px" />
      </div>
    `
  })
}

export const WithExcelDownload: Story = {
  name: '엑셀 다운로드',
  parameters: {
    docs: {
      source: {
        code: `<script setup lang="ts">
const gridRef = ref()

const download = () => {
  // const filename = prompt('엑셀 다운로드를 진행할까요?', '다운로드할 파일명')
  // if (filename) gridRef.value.excel(rows, filename)
}
</script>

<template>
  <button @click="download">엑셀 다운로드 (전체 데이터)</button>
  <RealGrid ref="gridRef" title="테스트 그리드" :columns="columns" :rows="rows" :excel="download" height="300px" />
</template>`
      }
    }
  },
  args: {
    columns,
    rows: rows.slice(0, 3),
    height: '300px'
  },
  render: args => {
    return {
      components: { RealGrid },
      setup() {
        const excel = useGridExcel()

        const download = () => {
          excel.get(prompt('엑셀 다운로드를 진행할까요?', '다운로드할 파일명'))
        }

        return { args, excel, download }
      },
      template: `
        <div class="flex flex-col gap-4">
          <button style="border:1px solid;cursor:pointer" @click="download">엑셀 다운로드 (전체 데이터)</button>
          <RealGrid ref="gridRef" title="테스트 그리드" v-bind="args" :excel="excel" />
        </div>
      `
    }
  }
}
