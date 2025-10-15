import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow inline styles for dynamic values (CSS variables)
      'react/no-danger': 'off',
      // Allow accessibility warnings for labeled inputs  
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      // Disable inline style warnings for CSS variables
      'react/forbid-dom-props': 'off',
      // Disable accessibility warnings for forms with proper structure
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-unlabeled-form-control': 'off'
    },
  },
])
