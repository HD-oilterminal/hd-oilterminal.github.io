<script setup lang="ts">
import { computed, ref } from 'vue'

import type { MenuLv1Item, MenuLv2Item } from '../../types/menu'

const props = defineProps<{ openAsIs?: (menuId: string) => boolean }>()

const menus = menuSystem()
const mdi = mdiSystem()
const { alert } = useAlert()
const { t } = useI18n()

const selectedId = ref('')
const isExpanded = ref(false)
const isHovering = ref(false)

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
  MNU50000: 'interface',
  MNU70000: 'gasoil',
  MNU90000: 'settings',
  MNU91000: 'operational_information'
}

const getIcon = (menuId: string) => `/images/${iconMap[menuId] ?? 'settings'}.svg`

// Utility(MNU92000)는 사이드바에서 제외 (기존 JS 동일)
const visibleLv1 = computed(() => menus.menuLv1.filter((m: MenuLv1Item) => m.menu_id !== 'MNU92000'))

const openUpperMenu = (menuId: string) => {
  isHovering.value = true

  if (selectedId.value === menuId && isExpanded.value) {
    // isExpanded.value = false
  } else {
    selectedId.value = menuId
    // isExpanded.value = true
  }
}

const openPage = (sub: MenuLv2Item) => {
  isExpanded.value = false

  if (props.openAsIs?.(sub.menu_id)) return

  if (mdi.tabs.every(t => t.id !== sub.menu_id)) {
    const max = document.getElementById('app-mdi')?.clientWidth ?? 0
    if ((mdi.tabs.length + 1) * 150 > max) {
      return alert(t('현재 열린 창이 너무 많습니다.'), { title: t('다른 창을 닫은 후 실행하세요.') })
    }
  }

  mdi.open({
    id: sub.menu_id,
    menuId: sub.menu_id,
    title: sub.menu_nm
  })
}

const close = () => {
  isExpanded.value = false
  isHovering.value = false
}
</script>

<template>
  <aside id="hdot-aside-nav" class="z-50 flex h-full flex-col">
    <nav
      class="relative z-2 h-full w-12"
      @mouseleave="isExpanded = false"
      @mouseenter="
        () => {
          isExpanded = true
          isHovering = false
        }
      "
    >
      <div
        class="absolute inset-y-0 left-0 z-10 flex flex-col overflow-hidden border-r border-gray-200 bg-gray-100 transition-[width] duration-100"
        :class="!isHovering && isExpanded ? 'w-66 shadow-lg' : 'w-12'"
      >
        <ul class="flex flex-1 flex-col gap-2 py-6">
          <li
            v-for="menu in visibleLv1"
            :key="menu.menu_id"
            class="group relative flex h-10 cursor-pointer items-center gap-3 rounded-lg px-1 hover:bg-blue-100"
            @click="openUpperMenu(menu.menu_id)"
          >
            <span class="absolute top-2.5 left-1 hidden h-5 w-0.5 rounded-full bg-blue-300 group-hover:block" />
            <div class="flex h-10 w-10 shrink-0 items-center justify-center">
              <img :src="getIcon(menu.menu_id)" :alt="menu.menu_nm" />
            </div>
            <span class="text-lg whitespace-nowrap text-gray-800">
              {{ menu.menu_nm }}
            </span>
          </li>
        </ul>
      </div>
    </nav>

    <div
      class="fixed left-12 z-1 h-full overflow-hidden transition-[width] duration-100"
      :class="isHovering ? 'w-full' : 'w-0'"
      @click="close"
    >
      <div class="h-full w-52 border-r border-gray-200 bg-white shadow-lg">
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span class="text-lg font-semibold text-gray-900">
            {{ menus.menuLv1.find((m: MenuLv1Item) => m.menu_id === selectedId)?.menu_nm }}
          </span>
          <button class="text-gray-400 hover:text-gray-700" @click="close">✕</button>
        </div>
        <ul class="py-1">
          <li
            v-for="sub in menus.getSubMenus(selectedId)"
            :key="sub.menu_id"
            class="cursor-pointer px-4 py-2.5 text-lg text-gray-700 hover:text-blue-700"
            :class="mdi.isOpen(sub.menu_id) ? 'font-medium text-blue-600' : 'hover:bg-blue-50'"
            style="transition: background 0.1s"
            @click="openPage(sub)"
          >
            {{ sub.menu_nm }}
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>
