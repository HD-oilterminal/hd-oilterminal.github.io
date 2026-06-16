import type { Meta, StoryObj } from '@storybook/vue3'
import type { DataValues } from 'realgrid'
import { ValueType } from 'realgrid'

import type { Columns } from '../../types/grid'
import { TextAlign } from '../../types/grid'
import rows from './ReadGrid.data.json'
import RealGrid from './RealGrid.vue'

const meta: Meta<typeof RealGrid> = {
  title: 'grid/RealGrid',
  component: RealGrid,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'text' },
    editable: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof RealGrid>

const columns: Columns = {
  artist: { header: '아티스트', width: 120 },
  title: { header: '곡명', width: 180 },
  album: { header: '앨범', width: 160, code: 'ALBUM', align: TextAlign.CENTER },
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

type ReadyPayload = { excel: (rows?: DataValues[], filename?: string) => void }

export const WithExcelDownload: Story = {
  name: '엑셀 다운로드 하는 리얼그리드',
  args: {
    title: '엑셀 다운로드',
    columns,
    rows: rows.slice(0, 3),
    height: '300px'
  },
  render: args => ({
    components: { RealGrid },
    setup() {
      let excelFn: ReadyPayload['excel'] | undefined

      const onReady = ({ excel }: ReadyPayload) => {
        excelFn = excel
      }

      const download = () => {
        let filename
        if ((filename = prompt('엑셀 다운로드를 진행할까요?', '다운로드할 파일명.xlsx'))) {
          excelFn?.(rows as DataValues[], filename)
        }
      }

      return { args, onReady, download }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button style="border:1px solid;cursor:pointer" @click="download">엑셀 다운로드 (전체 데이터)</button>
        <RealGrid title="테스트 그리드" v-bind="args" @ready="onReady" />
      </div>
    `
  })
}
