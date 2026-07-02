import { defineStore } from 'pinia'

export interface MdiTab {
  title: string
  id: string
  menuId?: string
  durable?: boolean
}

export const mdiSystem = defineStore('mdi-system', () => {
  const tabs = ref<MdiTab[]>([])
  const activeTabId = ref('')

  const isOpen = (id: string) => tabs.value.some(t => t.id === id)

  const open = (tab: MdiTab) => {
    if (!tab.menuId) tab.menuId = tab.id
    if (!isOpen(tab.id)) tabs.value.push(tab)

    activeTabId.value = tab.id

    console.info('MDI(open)', tab.id, tab.title)
  }

  const close = (id: string) => {
    const idx = tabs.value.findIndex(t => t.id === id)
    console.info('MDI(close)', idx, id, tabs.value.find(m => m.id === id)?.title)

    if (-1 === idx || tabs.value[idx].durable) return

    tabs.value.splice(idx, 1)
    if (activeTabId.value === id) {
      activeTabId.value = tabs.value[Math.max(0, idx - 1)]?.id ?? ''
    }
  }

  const activate = (id: string) => {
    console.info('MDI(act.)', id, tabs.value.find(m => m.id === id)?.title)

    activeTabId.value = id
  }

  return { tabs, activeTabId, isOpen, open, close, activate }
})
