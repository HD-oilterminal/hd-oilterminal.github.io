<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import { mdiSystem } from '../../stores/mdiSystem'
import Tooltip from '../commons/Tooltip.vue'

const mdi = mdiSystem()

// 세션 타이머
const sessionTime = ref('5:00:00')
const SESSION_TIMEOUT = 5 * 60 * 60
let remaining = SESSION_TIMEOUT
let timerId: ReturnType<typeof setInterval> | null = null

const tick = () => {
  if (remaining > 0) {
    remaining--
    const h = Math.floor(remaining / 3600)
    const m = String(Math.floor((remaining / 60) % 60)).padStart(2, '0')
    const s = String(Math.round(remaining % 60)).padStart(2, '0')
    sessionTime.value = `${h}:${m}:${s}`
  } else {
    sessionTime.value = '재로그인 필요'
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }
}

onMounted(() => {
  timerId = setInterval(tick, 1000)
})
onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})

const emit = defineEmits<{ logout: [] }>()

// 탭 스크롤
const tabs = ref<HTMLElement | null>(null)
const scrollTabs = (dir: -1 | 1) => {
  tabs.value?.scrollBy({ left: dir * 150, behavior: 'smooth' })
}

// 기존 header_navi_wrap 구성 그대로 (MNU92xxx)
const navIcons = [
  { code: 'MNU92040', icon: 'tank-map', label: '공장 배치도' },
  { code: 'MNU92050', icon: 'skd_ship', label: '해상 스케줄' },
  { code: 'MNU92060', icon: 'calculator', label: '탱크 물량계산기' },
  { code: 'MNU92070', icon: 'tasks', label: 'TLG 모니터' },
  { code: 'MNU92080', icon: 'cargo', label: '탱크별 성적' },
  { code: 'MNU92020', icon: 'handover', label: '인수인계' },
  { code: 'MNU92030', icon: 'notice', label: '알림' }
]
</script>

<template>
  <header class="flex h-12 shrink-0 items-stretch border-b border-gray-200 bg-gray-100">
    <div
      class="flex cursor-pointer items-center gap-2 border-r border-gray-200 px-3 hover:brightness-95"
      @click="mdi.activate('')"
    >
      <img src="/images/logo.svg" alt="HDOT" class="h-5 w-auto" />
      <div class="text-hdot-primary text-xs leading-3">
        <div class="text-bold text-[11px] text-gray-500">울산사업부</div>
        <span>처음인</span> <span>책임매니저</span>
      </div>

      <!--
      <button
        class="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gray-400 hover:bg-white/60 hover:text-gray-700"
        @click="emit('logout')"
      >
        <img src="/images/logout.svg" alt="" class="h-3.5 w-3.5 opacity-60" />
        {{ t('header.myinfo_popup.logout_btn') }}
      </button>
      -->
    </div>

    <!-- MDI 탭 바 (가로 스크롤) -->
    <div class="flex min-w-0 flex-1 items-stretch overflow-hidden">
      <button class="px-1 text-gray-400 hover:text-gray-600" @click="scrollTabs(-1)">‹</button>
      <ul ref="tabs" class="flex flex-1 scrollbar-none items-stretch gap-px overflow-x-auto text-xs">
        <li
          v-for="tab in mdi.tabs"
          :key="tab.id"
          class="group flex shrink-0 cursor-pointer items-center gap-1 border-b-2 px-3 transition-colors"
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
            v-if="tab.closable"
            class="ml-0.5 rounded p-0.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700"
            @click.stop="mdi.close(tab.id)"
          >
            ✕
          </button>
        </li>
      </ul>
      <button class="px-1 text-gray-400 hover:text-gray-600" @click="scrollTabs(1)">›</button>
    </div>

    <div class="flex items-center gap-4 border-l border-gray-200 px-3">
      <span class="text-xs text-gray-500 tabular-nums">{{ sessionTime }}</span>

      <div class="flex items-center gap-3">
        <Tooltip v-for="nav in navIcons" :key="nav.code" :content="nav.label" side="bottom">
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
