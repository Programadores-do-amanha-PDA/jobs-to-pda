import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import css from '@eslint/css'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
    {
        files: ['**/*.json'],
        language: 'json/json',
        ...json.configs.recommended,
    },
    {
        files: ['**/*.md'],
        plugins: { markdown },
        processor: 'markdown/markdown',
    },
    {
        files: ['**/*.css'],
        ...css.configs.recommended,
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: { globals: globals.browser },
    },
    eslintConfigPrettier,
]
