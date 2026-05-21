<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MainTab } from '@/types/main'

const { t } = useI18n()

const activeTab = ref<MainTab>('work')
const tabCounts = reactive<Record<MainTab, number>>({ work: 0, req: 0, doc: 0, vetting: 0 })

const ordTypeFilter = reactive({ sea: true, land: true, etc: true })
const columnFilter = reactive({
  cmpny_nm: true,
  reg_dt__ord_qy: true,
  option_string: true,
  memo: true,
})
const vtSttusFilter = reactive<Record<string, boolean>>({ '20': true })

const switchTab = (tab: MainTab) => {
  activeTab.value = tab
}
</script>

<template>
  <div class="flex h-full gap-4 overflow-hidden p-4">
    <div class="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
      <div class="flex items-center justify-between">
        <ul class="flex gap-1">
          <li
            v-for="tab in ['work', 'req', 'doc', 'vetting'] as MainTab[]"
            :key="tab"
            class="flex cursor-pointer items-center gap-1.5 rounded-t border border-b-0 px-3 py-1.5 text-sm font-medium transition-colors"
            :class="
              activeTab === tab
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            "
            @click="switchTab(tab)"
          >
            <span>{{ t(`main.tab.${tab}`) }}</span>
            <span
              class="min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-xs font-bold"
              :class="activeTab === tab ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'"
              >{{ tabCounts[tab] }}</span
            >
          </li>
        </ul>
      </div>

      <div class="rounded border border-gray-200 bg-white px-3 py-2">
        <ul class="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600">
          <template v-if="activeTab !== 'vetting'">
            <li class="flex items-center gap-2">
              <span class="font-medium text-gray-700">{{ t('main.filter.order_div') }}</span>
              <label
                v-for="key in ['sea', 'land', 'etc'] as const"
                :key="key"
                class="flex cursor-pointer items-center gap-1"
              >
                <input v-model="ordTypeFilter[key]" type="checkbox" class="accent-blue-500" />
                {{ t(`common.${key}`) }}
              </label>
            </li>
            <li class="flex items-center gap-2">
              <span class="font-medium text-gray-700">{{ t('main.filter.column_display') }}</span>
              <label class="flex cursor-pointer items-center gap-1">
                <input v-model="columnFilter.cmpny_nm" type="checkbox" class="accent-blue-500" />
                {{ t('main.col.partner_owner') }}
              </label>
              <label class="flex cursor-pointer items-center gap-1">
                <input
                  v-model="columnFilter.reg_dt__ord_qy"
                  type="checkbox"
                  class="accent-blue-500"
                />
                {{ t('main.col.ord_req_date') }}
              </label>
              <label class="flex cursor-pointer items-center gap-1">
                <input
                  v-model="columnFilter.option_string"
                  type="checkbox"
                  class="accent-blue-500"
                />
                {{ t('main.col.option') }}
              </label>
              <label class="flex cursor-pointer items-center gap-1">
                <input v-model="columnFilter.memo" type="checkbox" class="accent-blue-500" />
                {{ t('main.col.memo') }}
              </label>
            </li>
            <li class="ml-auto">
              <button
                class="rounded border border-blue-500 bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
              >
                {{ t('main.filter.search') }}
              </button>
            </li>
          </template>
          <template v-else>
            <li class="flex items-center gap-2">
              <span class="font-medium text-gray-700">{{ t('main.filter.sttus_div') }}</span>
              <label class="flex cursor-pointer items-center gap-1">
                <input v-model="vtSttusFilter['20']" type="checkbox" class="accent-blue-500" />
                {{ t('common.req') }}
              </label>
            </li>
            <li class="ml-auto">
              <button
                class="rounded border border-blue-500 bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
              >
                {{ t('main.filter.search') }}
              </button>
            </li>
          </template>
        </ul>
      </div>

      <template v-if="activeTab !== 'vetting'">
        <div
          class="flex min-h-0 flex-1 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-100"
        >
          <div class="text-center text-gray-400">
            <div class="mb-2 text-2xl">▦</div>
            <p class="text-sm font-medium">작업오더 그리드</p>
            <p class="text-xs">RealGrid 영역</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="flex min-h-0 flex-1 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-100"
        >
          <div class="text-center text-gray-400">
            <div class="mb-2 text-2xl">▦</div>
            <p class="text-sm font-medium">선박베팅 그리드</p>
            <p class="text-xs">RealGrid 영역</p>
          </div>
        </div>
      </template>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <span class="inline-block h-2 w-2 rounded-full bg-red-500" />
            {{ t('main.section.hzd_work') }}
          </span>
          <button class="text-xs text-gray-500 underline hover:text-gray-700">
            {{ t('main.section.view_all') }}
          </button>
        </div>
        <div
          class="flex items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-100"
          style="height: 160px"
        >
          <div class="text-center text-gray-400">
            <div class="mb-2 text-2xl">▦</div>
            <p class="text-sm font-medium">위험작업(작업허가) 그리드</p>
            <p class="text-xs">RealGrid 영역</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-[360px] flex-shrink-0 flex-col gap-2">
      <div class="flex items-center justify-between">
        <span class="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
          <span class="inline-block h-2 w-2 rounded-full bg-blue-500" />
          {{ t('main.section.handover') }}
        </span>
        <button class="text-xs text-gray-500 underline hover:text-gray-700">
          {{ t('main.section.view_all') }}
        </button>
      </div>
      <div
        class="flex flex-1 items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-100"
      >
        <div class="text-center text-gray-400">
          <div class="mb-2 text-2xl">📋</div>
          <p class="text-sm font-medium">인수인계 / 전달사항</p>
          <p class="text-xs">준비 중</p>
        </div>
      </div>
    </div>
  </div>
</template>
