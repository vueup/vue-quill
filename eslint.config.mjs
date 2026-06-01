import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
import vuePlugin from 'eslint-plugin-vue'

export default [
  {
    ignores: [
      'apps/**',
      'dist/**',
      'docs/**',
      'node_modules/**',
      'packages/*/dist/**',
      'temp/**',
      '**/shims-vue.d.ts',
    ],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  ...vuePlugin.configs['flat/recommended'],
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },
  {
    files: ['packages/*/src/**/*.ts'],
    rules: {
      quotes: ['error', 'single'],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: ['scripts/**/*.ts', '*.ts', '*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      'no-extra-semi': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
]
