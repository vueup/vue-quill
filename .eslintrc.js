module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  ignorePatterns: ['**/shims-vue.d.ts'],
  rules: {},
  overrides: [
    {
      files: ['**/__tests__/**', 'test-dts/**'],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off',
      },
    },
    {
      files: ['packages/*/src/**/*.ts'],
      rules: {
        quotes: ['error', 'single'],
      },
    },
    {
      files: ['scripts/**/*.ts', '*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
}
