import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'

import { useAlert } from '../../composables/useAlert'
import AlertLayer from './AlertLayer.vue'

export default {
  title: 'Layout/팝업-알림',
  component: AlertLayer,
  tags: ['autodocs']
} satisfies Meta<typeof AlertLayer>

const Wrapper = defineComponent({
  components: { AlertLayer },
  setup() {
    const { alert } = useAlert()

    const runSimple = async () => {
      await alert('처리가 완료되었습니다.')
    }

    const runWithTitle = async () => {
      await alert('저장 중 오류가 발생했습니다.', {
        title: '오류'
      })
    }

    const runWithDetail = async () => {
      await alert('서버 요청 처리 중 오류가 발생했습니다.', {
        title: '오류',
        detail:
          'Error: Connection refused\n  at Object.connect (/app/server.js:42:15)\n  at processTicksAndRejections (internal/process/task_queues.js:95:5)\nCause: ECONNREFUSED 127.0.0.1:5432\nCode: ECONNREFUSED'
      })
    }

    return { runSimple, runWithTitle, runWithDetail }
  },
  template: `
    <div class="flex flex-col items-start gap-3 p-6">
      <button class="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-50" @click="runSimple">단순 알림</button>
      <button class="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-50" @click="runWithTitle">제목 있는 오류</button>
      <button class="rounded border border-gray-300 px-3 py-1.5 hover:bg-gray-50" @click="runWithDetail">상세 내용 있는 오류</button>
      <AlertLayer />
    </div>
  `
})

export const Default: StoryObj = {
  parameters: {
    docs: {
      source: {
        code: `\
<!--suppress JSFileReferences -->
<script setup>
import { useAlert } from './composables/useAlert'

const { alert } = useAlert()

const runSimple = () => alert('처리가 완료되었습니다.')

const runWithTitle = () =>
  alert('저장 중 오류가 발생했습니다.', { title: '오류' })

const runWithDetail = () =>
  alert('서버 요청 처리 중 오류가 발생했습니다.', {
    title: '오류',
    detail: 'Error: Connection refused\\n  at Object.connect (/app/server.js:42:15)'
  })
<\/script>

<template>
  <button @click="runSimple">단순 알림</button>
  <button @click="runWithTitle">제목 있는 오류</button>
  <button @click="runWithDetail">상세 내용 있는 오류</button>

  <!-- 앱 루트에 한 번만 마운트 -->
  <AlertLayer />
</template>`
      }
    }
  },
  render: () => ({ name: '알림', components: { Wrapper }, template: '<Wrapper />' })
}
