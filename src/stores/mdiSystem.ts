import { defineStore } from 'pinia'

export interface MdiTab {
  title: string
  id: string
  menuId?: string
  closable?: boolean
}

export const mdiSystem = defineStore('mdi-system', () => {
  const tabs = ref<MdiTab[]>([])
  const activeTabId = ref('')

  const isOpen = (id: string) => tabs.value.some(t => t.id === id)

  const open = (tab: MdiTab): boolean => {
    if (!tab.menuId) tab.menuId = tab.id
    if (!isOpen(tab.id)) tabs.value.push(tab)

    activeTabId.value = tab.id
    return true
  }

  const close = (id: string) => {
    const idx = tabs.value.findIndex(t => t.id === id)
    if (-1 === idx || !tabs.value[idx].closable) return

    tabs.value.splice(idx, 1)
    if (activeTabId.value === id) {
      activeTabId.value = tabs.value[Math.max(0, idx - 1)]?.id ?? ''
    }
  }

  const activate = (id: string) => {
    activeTabId.value = id
  }

  return { tabs, activeTabId, isOpen, open, close, activate }
})
