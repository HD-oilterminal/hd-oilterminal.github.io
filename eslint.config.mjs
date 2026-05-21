import storybook from 'eslint-plugin-storybook'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default [
  ...storybook.configs['flat/recommended'],
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // @storybook/vue3 에서 Meta/StoryObj 타입을 import하는 건 정상
      'storybook/no-renderer-packages': 'off',
      // 컴포넌트 이름 두 단어 강제 해제
      'vue/multi-word-component-names': 'off',
      // 포맷팅 규칙 (prettier 위임)
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
    },
  },
  prettierConfig,
]
