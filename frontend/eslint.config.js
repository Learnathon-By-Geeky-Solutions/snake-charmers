import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'no-console': 'warn', // Warn on console statements
      'quotes': ['error', 'single'], // Enforce single quotes
      'semi': ['error', 'always'], // Enforce semicolons
      'indent': ['error', 2], // Enforce 2-space indentation
      'no-unused-vars': ['warn', { 'args': 'none' }], // Warn on unused variables, ignoring unused function arguments
      'eqeqeq': ['error', 'always'], // Enforce strict equality (=== and !==)
      // 'no-magic-numbers': ['warn', { 'ignore': [0, 1] }], // Warn on magic numbers except 0 and 1
      // 'max-len': ['warn', { 'code': 150 }] // Warn if a line exceeds 80 characters
      'import/extensions': ['error', 'always', {
        'js': 'never',
        'jsx': 'always'
      }],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx']
        }
      }
    }
  },
];
