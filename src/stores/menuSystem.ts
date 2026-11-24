import 'pinia-plugin-persistedstate'

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MenuLv1Item {
  menu_id: string
  menu_nm: string
  menu_nm_eng?: string
  dsply_ordr: number
  icon_nm?: string
}

export interface MenuLv2Item {
  menu_id: string
  upper_menu_id: string
  menu_nm: string
  menu_nm_eng?: string
  page_url: string
  controller_url: string
  dsply_ordr: number
}

export interface TotalMenuContent {
  menu_lv1_list: MenuLv1Item[]
  menu_lv2_list: MenuLv2Item[]
}

export const menuSystem = defineStore(
  'menu-system',
  () => {
    const menuLv1 = ref<MenuLv1Item[]>([])
    const menuLv2 = ref<MenuLv2Item[]>([])
    const descriptions = ref<{ [key: string]: string }>({})
    const activeUpperMenuId = ref('')

    const load = async (_menus?: TotalMenuContent) => {
      menuLv1.value = _menus?.menu_lv1_list ?? []
      menuLv2.value = _menus?.menu_lv2_list ?? []
    }

    const clear = () => {
      menuLv1.value = []
      menuLv2.value = []
      console.log('clear menus😉')
    }

    const getSubMenus = (upperMenuId: string): MenuLv2Item[] => menuLv2.value.filter(m => m.upper_menu_id === upperMenuId)

    const hasAccess = (menuId: string): boolean =>
      menuLv1.value.some(m => m.menu_id === menuId) || menuLv2.value.some(m => m.menu_id === menuId)

    const getDescription = (menuId: string): string => {
      return descriptions.value[menuId]
    }

    const setDescription = (menuId: string, description: string) => {
      descriptions.value[menuId] = description
    }

    return {
      menuLv1,
      menuLv2,
      activeUpperMenuId,
      load,
      clear,
      getSubMenus,
      hasAccess,
      descriptions,
      getDescription,
      setDescription
    }
  },
  {
    persist: { pick: ['menuLv1', 'menuLv2', 'descriptions'], storage: sessionStorage }
  }
)
