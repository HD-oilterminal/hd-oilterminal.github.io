<script setup lang="ts">
import { onMounted, ref } from 'vue'

const SESSION_TIMEOUT = 5 * 60 * 60

//
const mdi = mdiSystem()
const { alert } = useAlert()
const { t } = useI18n()

//
const sessionTime = ref('5:00:00')

//
onMounted(() => {
  ;(() => {
    window._session_time = Date.now()

    setTimeout(function tick() {
      const elapsed = SESSION_TIMEOUT - Math.floor((Date.now() - window._session_time) / 1000)
      if (elapsed < 0) {
        sessionTime.value = '-'
        return alert(t('자동 로그아웃 되었습니다.'), { title: '사용시간 만료' })
      }

      const hrs = Math.floor(elapsed / 3600)
      const min = String(Math.floor((elapsed / 60) % 60)).padStart(2, '0')
      const sec = String(Math.round(elapsed % 60)).padStart(2, '0')
      sessionTime.value = `${hrs}:${min}:${sec}`.replace(/^[0:]*/, '')

      setTimeout(tick, 1000)
    }, 1000)
  })()
})
</script>

<template>
  <header class="flex h-12 shrink-0 items-stretch border-b border-gray-200 bg-gray-100">
    <div class="flex cursor-pointer items-center gap-4 px-3 hover:brightness-95">
      <img src="/images/logo.svg" alt="HDOT" class="h-5 w-auto" @click="mdi.activate('')" />
      <slot name="logged-user" />
    </div>

    <div id="app-mdi" class="flex min-w-0 flex-1 items-stretch overflow-hidden">
      <ul ref="tabs" class="text-md flex flex-1 scrollbar-none items-stretch gap-px overflow-x-auto">
        <li
          v-for="tab in mdi.tabs"
          :key="tab.id"
          class="group relative inline-flex w-37.5 shrink-0 cursor-pointer items-center border-t border-l border-l-gray-200 px-3 transition-colors"
          :class="
            tab.id === mdi.activeTabId
              ? 'border-b-primary-600 border-b border-t-transparent bg-white font-semibold'
              : 'border-t-transparent text-gray-500 hover:bg-white/60 hover:text-gray-700'
          "
          @click="mdi.activate(tab.id)"
        >
          <span class="max-w-40 truncate">{{ tab.title }}</span>
          <button
            v-if="!tab.durable"
            class="absolute right-1 z-10 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-white p-2 font-bold group-hover:flex"
            @click.stop="mdi.close(tab.id)"
          >
            ✕
          </button>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-4 px-3">
      <span class="font-mono text-gray-500">{{ sessionTime }}</span>

      <div class="flex items-center gap-2">
        <slot name="utility" />
      </div>
    </div>
  </header>
</template>
