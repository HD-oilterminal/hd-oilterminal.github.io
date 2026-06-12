import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Codes } from '@/types/core'

export const useCodesStore = defineStore('mdi', () => {
  const codes = ref<Codes>({
    ALBUM: [
      { code: 'KARMA', name: '카르마', englishName: 'k-a-r-m-a' },
      { code: 'Around', name: '어라운드', englishName: 'a-r-o-u-n-d' },
      { code: 'Swanson', name: '스완쓴', englishName: 's-w-a-n-s-o-n' },
      { code: 'BTS', name: '윙즈', englishName: 'b-t-s' }
    ]
  })

  return {
    codes,
    list(code: string) {
      return codes.value[code]
    }
  }
})
