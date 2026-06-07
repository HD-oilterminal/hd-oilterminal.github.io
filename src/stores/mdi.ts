import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { MdiTab } from '../types/mdi'

export const useMdiStore = defineStore('mdi', () => {
  const tabs = ref<MdiTab[]>([])
  const activeTabId = ref('')

  const activate = (id: string) => {
    activeTabId.value = id
  }

  const closeTab = (id: string) => {
    tabs.value = tabs.value.filter(t => t.id !== id)
    if (activeTabId.value === id) {
      activeTabId.value = tabs.value.at(-1)?.id ?? ''
    }
  }

  const openTab = (tab: MdiTab): boolean => {
    const exists = tabs.value.some(t => t.id === tab.id)
    if (!exists) tabs.value.push(tab)
    activeTabId.value = tab.id
    return !exists
  }

  const isOpen = (id: string) => tabs.value.some(t => t.id === id)

  return { tabs, activeTabId, activate, closeTab, openTab, isOpen }
})
