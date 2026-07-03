<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Tooltip from '../../components/commons/Tooltip.vue'

const SESSION_TIMEOUT = 5 * 60 * 60
const ICONS = [
  { code: 'MNU92040', icon: 'tank-map', label: '공장 배치도' },
  { code: 'MNU92050', icon: 'skd_ship', label: '해상 스케줄' },
  { code: 'MNU92060', icon: 'calculator', label: '탱크 물량계산기' },
  { code: 'MNU92070', icon: 'tasks', label: 'TLG 모니터' },
  { code: 'MNU92080', icon: 'cargo', label: '탱크별 성적' },
  { code: 'MNU92020', icon: 'handover', label: '인수인계' },
  { code: 'MNU92030', icon: 'notice', label: '알림' }
]

//
const mdi = mdiSystem()
const { alert } = useAlert()
const { t } = useI18n()

//
const tabs = ref()
const sessionTime = ref('5:00:00')

//
const onMDIBarScroll = (dir: -1 | 1) => {
  tabs.value?.scrollBy({ left: dir * 150, behavior: 'smooth' })
}

//
onMounted(() => {
  ;(() => {
    const started = Date.now()

    setTimeout(function tick() {
      const elapsed = SESSION_TIMEOUT - Math.floor((Date.now() - started) / 1000)
      if (elapsed < 0) return alert(t('자동 로그아웃 되었습니다.'), { title: '사용시간 만료' })

      const hrs = Math.floor(elapsed / 3600)
      const min = String(Math.floor((elapsed / 60) % 60))
      const sec = String(Math.round(elapsed % 60)).padStart(2, '0')
      sessionTime.value = `${hrs ? hrs + ':' : ''}${min ? min + ':' : ''}${sec}`

      setTimeout(tick, 1000)
    }, 1000)
  })()
})
</script>

<template>
  <header class="flex h-12 shrink-0 items-stretch border-b border-gray-200 bg-gray-100">
    <div class="flex cursor-pointer items-center gap-2 border-r border-gray-200 px-3 hover:brightness-95">
      <img src="/images/logo.svg" alt="HDOT" class="h-5 w-auto" @click="mdi.activate('')" />
      <slot name="logged-user" />
    </div>

    <div class="flex min-w-0 flex-1 items-stretch overflow-hidden">
      <button class="px-1 text-gray-400 hover:text-gray-600" @click="onMDIBarScroll(-1)">‹</button>
      <ul ref="tabs" class="flex flex-1 scrollbar-none items-stretch gap-px overflow-x-auto text-sm">
        <li
          v-for="tab in mdi.tabs"
          :key="tab.id"
          class="group relative inline-flex shrink-0 cursor-pointer items-center border-b-2 px-3 transition-colors"
          :class="
            tab.id === mdi.activeTabId
              ? 'border-b-2 bg-white font-semibold'
              : 'border-transparent text-gray-500 hover:bg-white/60 hover:text-gray-700'
          "
          :style="
            tab.id === mdi.activeTabId ? 'border-bottom-color:var(--color-hdot-primary); color:var(--color-hdot-primary)' : ''
          "
          @click="mdi.activate(tab.id)"
        >
          <span class="max-w-40 truncate">{{ tab.title }}</span>
          <button
            v-if="!tab.durable"
            class="absolute -right-2.5 z-10 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-gray-200 p-2 text-xs font-bold group-hover:flex"
            @click.stop="mdi.close(tab.id)"
          >
            ✕
          </button>
        </li>
      </ul>
      <button class="px-1 text-gray-400 hover:text-gray-600" @click="onMDIBarScroll(1)">›</button>
    </div>

    <div class="flex items-center gap-4 border-l border-gray-200 px-3">
      <span class="font-mono text-xs text-gray-500 tabular-nums">{{ sessionTime }}</span>

      <div class="flex items-center gap-3">
        <Tooltip v-for="nav in ICONS" :key="nav.code" :content="nav.label" side="bottom">
          <button
            type="button"
            class="navi flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100"
            :data-open_popup_code="nav.code"
          >
            <img :src="`/images/${nav.icon}.svg`" :alt="nav.label" class="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
    </div>
  </header>
</template>
