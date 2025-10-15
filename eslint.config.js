import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: [
      'customers-api/src/**/*.{js,mjs,cjs}',
      'orders-api/src/**/*.{js,mjs,cjs}',
      'lambda-orchestrator/**/*.js',
      '*.js'
    ],
    ignores: ['node_modules/**', 'dist/**', 'db/**', '*.log'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      semi: ['error', 'always'],
      quotes: ['error', 'single']
    }
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  }
]);
