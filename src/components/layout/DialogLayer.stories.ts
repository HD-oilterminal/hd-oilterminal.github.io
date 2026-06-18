import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent } from 'vue'

import { useDialog } from '../../composables/useDialog'
import DialogLayer from './DialogLayer.vue'

export default {
  title: 'Layout/팝업-확인&질문',
  component: DialogLayer,
  tags: ['autodocs']
} satisfies Meta<typeof DialogLayer>

const Wrapper = defineComponent({
  components: { DialogLayer },
  setup() {
    const { confirm, prompt } = useDialog()
    const result = ref('')

    const runConfirm = async () => {
      const ok = await confirm('저장하시겠습니까?')
      result.value = ok ? '확인 선택' : '취소 선택'
    }

    const runPrompt = async () => {
      const ok = await prompt('새 이름을 입력하세요.', {
        title: '이름 변경',
        placeholder: '이름 입력',
        defaultValue: '기존 이름'
      })

      result.value = ok !== null ? `입력값: ${ok}` : '취소 선택'
    }

    return { runConfirm, runPrompt, result }
  },
  template: `
    <div class="flex flex-col items-start gap-3 p-6">
      <button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="runConfirm">confirm 열기</button>
      <button class="rounded border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" @click="runPrompt">prompt 열기</button>
      <p class="text-sm text-gray-500">결과: {{ result }}</p>

      <DialogLayer />
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
import { useDialog } from './composables/useDialog'

const { confirm, prompt } = useDialog()
const result = ref('')

const runConfirm = async () => {
  const ok = await confirm('저장하시겠습니까?')
  result.value = ok ? '확인 선택' : '취소 선택'
}

const runPrompt = async () => {
  const value = await prompt('새 이름을 입력하세요.', {
    title: '이름 변경',
    placeholder: '이름 입력',
    defaultValue: '기존 이름'
  })
  result.value = value !== undefined ? \`입력값: \${value}\` : '취소 선택'
}
<\/script>

<template>
  <button @click="runConfirm">confirm 열기</button>
  <button @click="runPrompt">prompt 열기</button>
  <p>결과: {{ result }}</p>

  <!-- 앱 루트에 한 번만 마운트 -->
  <DialogLayer />
</template>`
      }
    }
  },
  render: () => ({ name: '다이얼로그', components: { Wrapper }, template: '<Wrapper />' })
}
