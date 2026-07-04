<script setup lang="ts">
import { computed, ref } from 'vue'

import type { MenuLv1Item, MenuLv2Item } from '../../types/menu'
import Tooltip from '../commons/Tooltip.vue'

const menus = menuSystem()
const mdi = mdiSystem()

const activeUpperId = ref('')
const isExpanded = ref(false)

const iconMap: Record<string, string> = {
  MNU01000: 'information',
  MNU02000: 'contract',
  MNU03000: 'invoice',
  MNU04000: 'ship',
  MNU05000: 'operation',
  MNU100000: 'tank',
  MNU07000: 'inventory',
  MNU08000: 'daily',
  MNU09000: 'equipment',
  MNU10000: 'report2',
  MNU11000: 'document',
  MNU50000: 'settings',
  MNU70000: 'settings',
  MNU90000: 'settings',
  MNU91000: 'operational_information'
}

const getIcon = (menuId: string) => `/images/${iconMap[menuId] ?? 'settings'}.svg`

// Utility(MNU92000)는 사이드바에서 제외 (기존 JS 동일)
const visibleLv1 = computed(() => menus.menuLv1.filter((m: MenuLv1Item) => m.menu_id !== 'MNU92000'))

const openUpperMenu = (menuId: string) => {
  if (activeUpperId.value === menuId && isExpanded.value) {
    isExpanded.value = false
  } else {
    activeUpperId.value = menuId
    isExpanded.value = true
  }
}

const openPage = (sub: MenuLv2Item) => {
  isExpanded.value = false

  mdi.open({
    id: sub.menu_id,
    menuId: sub.menu_id,
    title: sub.menu_nm
  })
}

const close = () => {
  isExpanded.value = false
}
</script>

<template>
  <nav class="z-50 flex h-full flex-col" @mouseleave="close">
    <Transition name="slide">
      <div v-if="isExpanded && activeUpperId" class="fixed left-12 h-full w-52 border-r border-gray-200 bg-white shadow-lg">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span class="text-lg font-semibold text-gray-900">
            {{ menus.menuLv1.find((m: MenuLv1Item) => m.menu_id === activeUpperId)?.menu_nm }}
          </span>
          <button class="text-gray-400 hover:text-gray-700" @click="close">✕</button>
        </div>
        <ul class="py-1">
          <li
            v-for="sub in menus.getSubMenus(activeUpperId)"
            :key="sub.menu_id"
            class="text-md cursor-pointer px-4 py-2.5 text-gray-700 hover:text-blue-700"
            :class="mdi.isOpen(sub.menu_id) ? 'font-medium text-blue-600' : 'hover:bg-blue-50'"
            style="transition: background 0.1s"
            @click="openPage(sub)"
          >
            {{ sub.menu_nm }}
          </li>
        </ul>
      </div>
    </Transition>

    <div class="relative flex h-full w-12 flex-col border-r border-gray-200 bg-gray-100">
      <ul class="flex flex-1 flex-col items-center gap-2 py-6">
        <li v-for="menu in visibleLv1" :key="menu.menu_id" @click="openUpperMenu(menu.menu_id)">
          <Tooltip :content="menu.menu_nm" side="right">
            <div class="relative flex h-10 w-10 items-center justify-center">
              <span
                v-if="activeUpperId === menu.menu_id && isExpanded"
                class="bg-primary-700 absolute top-2.5 left-0 h-5 w-0.5 rounded-full"
              />
              <img :src="getIcon(menu.menu_id)" :alt="menu.menu_nm" />
            </div>
          </Tooltip>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
/*noinspection ALL*/
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.18s ease;
}

/*noinspection ALL*/
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
