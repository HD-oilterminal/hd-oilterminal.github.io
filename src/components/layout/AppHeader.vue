<script setup lang="ts">
const { t } = useI18n()
const mdiStore = useMdiStore()

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
const tabsEl = ref<HTMLElement | null>(null)
const scrollTabs = (dir: -1 | 1) => {
  tabsEl.value?.scrollBy({ left: dir * 150, behavior: 'smooth' })
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
  <header
    class="flex h-12 shrink-0 items-stretch border-b border-gray-200"
    style="background-color: #ebecf6"
  >
    <!-- 로고 + 프로필 (기존 shrink_btn_wrap) -->
    <div
      class="flex cursor-pointer items-center gap-3 border-r border-gray-200 px-3 hover:brightness-95"
      style="min-width: 180px"
      @click="mdiStore.activate('op_main')"
    >
      <img src="/images/logo.svg" alt="HDOT" class="h-5 w-auto" />
      <div class="flex items-center gap-1 text-[11px] text-gray-400">
        <span>—</span><span>—</span><span>—</span>
      </div>
    </div>

    <!-- MDI 탭 바 (가로 스크롤) -->
    <div class="flex min-w-0 flex-1 items-stretch overflow-hidden">
      <button class="px-1 text-gray-400 hover:text-gray-600" @click="scrollTabs(-1)">‹</button>
      <ul
        ref="tabsEl"
        class="flex flex-1 items-stretch gap-px overflow-x-auto"
        style="scrollbar-width: none"
      >
        <li
          v-for="tab in mdiStore.tabs"
          :key="tab.id"
          class="group flex shrink-0 cursor-pointer items-center gap-1 border-b-2 px-3 text-xs transition-colors"
          :class="
            tab.id === mdiStore.activeTabId
              ? 'border-b-2 bg-white font-semibold'
              : 'border-transparent text-gray-500 hover:bg-white/60 hover:text-gray-700'
          "
          :style="
            tab.id === mdiStore.activeTabId ? 'border-bottom-color:#1e6afb; color:#1e6afb' : ''
          "
          @click="mdiStore.activate(tab.id)"
        >
          <span class="max-w-40 truncate">{{ tab.title }}</span>
          <button
            v-if="tab.closable"
            class="ml-0.5 rounded p-0.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700"
            @click.stop="mdiStore.closeTab(tab.id)"
          >
            ✕
          </button>
        </li>
      </ul>
      <button class="px-1 text-gray-400 hover:text-gray-600" @click="scrollTabs(1)">›</button>
    </div>

    <!-- 우측: header_navi_wrap + 세션 + 프로필 -->
    <div class="flex items-center gap-3 border-l border-gray-200 px-3">
      <!-- 세션 타이머 -->
      <span class="text-xs text-gray-500 tabular-nums">{{ sessionTime }}</span>

      <!-- 단축 아이콘 (기존 h_right header_navi_wrap 동일 구조) -->
      <div class="flex items-center gap-4">
        <button
          v-for="nav in navIcons"
          :key="nav.code"
          type="button"
          class="navi group relative flex flex-col items-center gap-0.5"
          :data-open_popup_code="nav.code"
        >
          <img
            :src="`/images/${nav.icon}.svg`"
            :alt="nav.label"
            class="h-5 w-5 opacity-60 group-hover:opacity-100"
          />
          <!-- 기존 span: 호버 시 하단 툴팁 -->
          <span
            class="pointer-events-none absolute -bottom-7 left-1/2 hidden -translate-x-1/2 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 group-hover:block"
            style="white-space: nowrap"
          >
            {{ nav.label }}
          </span>
        </button>
      </div>

      <!-- 로그아웃 (작게) -->
      <button
        class="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-gray-400 hover:bg-white/60 hover:text-gray-700"
        @click="emit('logout')"
      >
        <img src="/images/logout.svg" alt="" class="h-3.5 w-3.5 opacity-60" />
        {{ t('header.myinfo_popup.logout_btn') }}
      </button>
    </div>
  </header>
</template>
