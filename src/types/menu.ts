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
  dsply_ordr: number
}
