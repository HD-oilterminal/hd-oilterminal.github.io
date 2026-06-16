import '../src/assets/tailwind.css'

import type { Preview } from '@storybook/vue3'
import JSZip from 'jszip'

declare global {
  interface Window {
    JSZip: typeof JSZip
  }
}

window.JSZip = JSZip
import { setup } from '@storybook/vue3'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { createPinia, setActivePinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import RealGrid, { CalendarMode, SelectionStyle } from 'realgrid'
import { createI18n } from 'vue-i18n'

import ko from '../src/i18n/ko'

dayjs.extend(customParseFormat)

//
RealGrid.setLicenseKey(import.meta.env.VITE_REALGRID_KEY)
RealGrid.setDefault({
  editor: {
    dateCellEditor: {
      viewMode: CalendarMode.MONTH
    },
    numberCellEditor: {
      showStepButton: true
    }
  },
  edit: {
    editable: false,
    checkable: true,
    commitByCell: true,
    commitWhenLeave: true,
    columnEditableFirst: false,
    movable: false
  },
  rowIndicator: {
    visible: false
  },
  stateBar: {
    visible: false
  },
  checkBar: {
    visible: true
  },
  header: {
    height: 30
  },
  footer: {
    visible: false
  },
  display: {
    rowHeight: -1,
    minRowHeight: 28,
    maxRowHeight: 26,
    rowResizable: true,
    eachRowResizable: true,
    selectionStyle: SelectionStyle.ROWS,
    vscrollBar: true
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
setActivePinia(pinia)

const i18n = createI18n({ legacy: false, locale: 'ko', messages: { ko } })

setup(app => {
  app.use(pinia)
  app.use(i18n)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'ko-KR'
      }
    }
  }
}

export default preview
