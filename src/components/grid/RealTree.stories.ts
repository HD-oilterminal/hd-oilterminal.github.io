import type { Meta, StoryObj } from '@storybook/vue3'
import { ValueType } from 'realgrid'
import { ref } from 'vue'

import { numeric } from '../../composables/useFormat'
import type { Columns, Rows } from '../../types/core'
import rows from './RealTree.data.json'
import RealTree from './RealTree.vue'

const meta: Meta<typeof RealTree> = {
  title: 'grid/RealTree',
  component: RealTree,
  tags: ['autodocs'],
  argTypes: {
    height: { control: 'text' },
    editable: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof RealTree>

const columns: Columns = {
  number: {
    width: 70,
    header: 'No',
    displaying: value => {
      return value === '0' ? '' : String(value ?? '')
    }
  },
  id: {
    width: 120,
    header: {
      template: '${top}<i>${bottom}</i>',
      values: { top: '소설번호', bottom: '챕터번호' }
    },
    styling: dataCell => {
      if (Number.isNaN(parseInt(String(dataCell?.value)))) {
        return { styleName: 'grid-cell-pointer-text-blue' }
      }
    }
  },
  genreCode: {
    width: 70,
    header: {
      template: '${top}<i>${bottom}</i>',
      values: { top: '장르코드', bottom: '유형' }
    }
  },
  publisher: {
    header: '출판사'
  },
  statusDisplay: {
    width: 80,
    header: {
      template: '${top}<i>${bot}</i>',
      values: { top: '출판상태', bot: '열람상태' }
    }
  },
  status: {
    width: 80,
    header: '상태',
    visible: false
  },
  name: {
    width: 150,
    header: {
      template: '${top}<i>${bot}</i>',
      values: { top: '소설명', bot: '등장인물' }
    }
  },
  category: {
    width: 120,
    header: {
      template: '${top}<i>${bottom}</i>',
      values: { top: '시리즈', bottom: '장르' }
    }
  },
  dateOrQuantityGroup: {
    header: {
      template: '${top}<i>${bottom}</i>',
      values: { top: '등록일', bottom: '페이지수' }
    },
    subColumns: {
      dateOrQuantity: {
        displaying: (value, index, grid) => {
          const row = grid.getDataSource().getJsonRow(index.dataRow ?? 0)
          if (row.number > 0) return String(value ?? '')
          return numeric(value)
        },
        spanning: () => {
          return 1
        }
      },
      pageUnit: {
        width: 70
      }
    }
  },
  wordCountGroup: {
    header: '글자수',
    subColumns: {
      wordCount: {
        type: ValueType.NUMBER
      },
      wordCountUnit: {
        width: 70
      }
    }
  },
  startDate: {
    width: 120,
    header: {
      template: '${top}<i>${bottom}</i>',
      values: { top: '출판예정일', bottom: '열람시작일' }
    }
  },
  endDate: {
    width: 120,
    header: {
      template: '${top}<i>${bottom}</i>',
      values: { top: '발매예정일', bottom: '열람종료일' }
    }
  },
  option: {
    width: 120,
    header: '옵션'
  },
  memo: {
    width: 200,
    header: '메모'
  }
}

export const Default: Story = {
  args: {
    title: '테스트 리얼트리',
    columns,
    rows,
    treeColumnKey: 'chapters',
    height: '400px',
    headerHeight: 50,
    fixed: {
      column: 2
    }
  }
}

export const WithExcelDownload: Story = {
  parameters: {
    docs: {
      source: {
        code: `<script setup lang="ts">
import { ref } from 'vue'

const treeRef = ref()

const download = () => treeRef.value.excel(rows)
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:8px;">
    <button @click="download">엑셀 다운로드 (전체 데이터)</button>
    <RealTree ref="treeRef" title="엑셀 다운로드" :columns="columns" :rows="rows" treeColumnKey="chapters" height="400px" />
  </div>
</template>`
      }
    }
  },
  args: {
    title: '엑셀 다운로드',
    columns,
    rows: rows.slice(0, 2),
    treeColumnKey: 'chapters',
    height: '400px',
    headerHeight: 50,
    fixed: { column: 2 }
  },
  render: args => ({
    components: { RealTree },
    setup() {
      const treeRef = ref<InstanceType<typeof RealTree>>()

      const download = () => treeRef.value?.excel(rows as Rows)

      return { args, treeRef, download }
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button @click="download">엑셀 다운로드 (전체 데이터)</button>
        <RealTree title="샘플 트리그리드" ref="treeRef" v-bind="args" />
      </div>
    `
  })
}
