<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MenuLv2Item } from '@/types/menu'
import { useMenuStore } from '@/stores/menu'
import { useMdiStore } from '@/stores/mdi'

const menuStore = useMenuStore()
const mdiStore = useMdiStore()

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
  MNU91000: 'operational_information',
}

const getIcon = (menuId: string) => `/images/${iconMap[menuId] ?? 'settings'}.svg`

const visibleLv1 = computed(() => menuStore.menuLv1.filter((m) => m.menu_id !== 'MNU92000'))

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
  if (sub.menu_id === 'op_main') {
    mdiStore.activate('op_main')
    return
  }
  const opened = mdiStore.openTab({
    id: sub.menu_id,
    menuId: sub.menu_id,
    title: sub.menu_nm,
    closable: true,
  })
  if (!opened) mdiStore.activate(sub.menu_id)
}

const close = () => {
  isExpanded.value = false
}
</script>

<template>
  <nav class="flex h-full flex-col">
    <Transition name="slide">
      <div
        v-if="isExpanded && activeUpperId"
        class="fixed left-[48px] h-full w-52 border-r border-gray-200 bg-white shadow-lg"
      >
        <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span class="text-sm font-semibold text-gray-900">
            {{ menuStore.menuLv1.find((m) => m.menu_id === activeUpperId)?.menu_nm }}
          </span>
          <button class="text-gray-400 hover:text-gray-700" @click="close">✕</button>
        </div>
        <ul class="py-1">
          <li
            v-for="sub in menuStore.getSubMenus(activeUpperId)"
            :key="sub.menu_id"
            class="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:text-blue-700"
            :class="mdiStore.isOpen(sub.menu_id) ? 'font-medium text-blue-600' : 'hover:bg-blue-50'"
            style="transition: background 0.1s"
            @click="openPage(sub)"
          >
            {{ sub.menu_nm }}
          </li>
        </ul>
      </div>
    </Transition>

    <div class="relative flex h-full w-12 flex-col border-r border-gray-200 bg-[#ebecf6]">
      <ul class="flex flex-1 flex-col items-center gap-2 py-6">
        <li
          v-for="menu in visibleLv1"
          :key="menu.menu_id"
          class="group relative flex w-full cursor-pointer items-center justify-center"
          style="height: 40px"
          @click="openUpperMenu(menu.menu_id)"
        >
          <span
            v-if="activeUpperId === menu.menu_id && isExpanded"
            class="absolute left-1 top-[10px] h-5 w-0.5 rounded-full bg-[#1e6afb]"
          />
          <img
            :src="getIcon(menu.menu_id)"
            :alt="menu.menu_nm"
            class="h-5 w-5 transition-opacity"
            :class="
              activeUpperId === menu.menu_id && isExpanded
                ? 'opacity-100'
                : 'opacity-60 group-hover:opacity-90'
            "
          />
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.18s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
