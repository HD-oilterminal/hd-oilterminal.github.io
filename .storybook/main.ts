import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath, URL } from 'url'

const srcDir = fileURLToPath(new URL('../src', import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  viteFinal: async config => {
    config.plugins = [
      ...(config.plugins ?? []),
      tailwindcss(),
      vue(),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          'vue-i18n',
          {
            '#app': ['navigateTo', 'useNuxtApp', 'useRuntimeConfig']
          }
        ],
        dirs: [`${srcDir}/stores`, `${srcDir}/composables`],
        dts: false
      })
    ]
    config.resolve ??= {}
    config.resolve.alias = {
      ...((config.resolve.alias as Record<string, string>) ?? {}),
      '@': srcDir,
      '~': srcDir,
      '#app': fileURLToPath(new URL('./nuxt-mock.ts', import.meta.url))
    }
    config.resolve.dedupe = [
      'vue',
      'pinia',
      'vue-i18n',
      'realgrid',
      'reka-ui',
      '@internationalized/date',
      'dayjs'
    ]
    return config
  }
}

export default config
