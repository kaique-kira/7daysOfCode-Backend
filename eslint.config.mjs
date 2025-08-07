import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
export default [
  {
    ignores: ['dist/**', 'test/**'],
  },
  {
    // Configuração base para JavaScript
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
          allowUnboundThis: false,
        },
      ],
      'no-useless-return': 'error',
      'prefer-template': 'error',
      'no-template-curly-in-string': 'error',
      curly: ['error', 'multi-or-nest'],
      'function-call-argument-newline': ['error', 'consistent'],
      'func-call-spacing': ['error', 'never'],
      'no-unused-expressions': 'warn',
    },
  },
  {
    // Configuração para TypeScript
    files: ['**/*.ts', '**/*.tsx', 'test/**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        describe: true,
        before: true,
        it: true,
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Regras mais flexíveis para Promises
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false, // Permite não tratar o retorno de Promises em alguns casos
        },
      ],
      '@typescript-eslint/no-floating-promises': 'off', // Desativa a obrigação de tratar todas as Promises
      '@typescript-eslint/promise-function-async': 'off', // Não obriga funções que retornam Promise a serem async
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Outras regras do TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable', 'function'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['class', 'interface', 'typeAlias', 'typeParameter'],
          format: ['PascalCase'],
        },
        {
          selector: ['enumMember'],
          modifiers: ['const'],
          format: ['UPPER_CASE'],
        },
        {
          selector: ['method'],
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: ['property'],
          format: ['camelCase', 'PascalCase', 'snake_case'],
        },
      ],
      // '@typescript-eslint/no-explicit-any': 'warn', // Mudei para warn ao invés de error
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    // Configurações específicas para controllers e services
    files: ['**/*.controller.ts', '**/*.service.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off', // Desativa em controllers/services
      '@typescript-eslint/require-await': 'off', // Não obriga funções async a terem await
    },
  },
  {
    // Configuração do Prettier (aplica a todos os arquivos)
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          tabWidth: 2,
          useTabs: false,
          printWidth: 80,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: true,
          endOfLine: 'auto',
          overrides: [
            {
              files: '*.yaml',
              options: {
                bracketSameLine: false,
                proseWrap: 'always',
              },
            },
          ],
        },
      ],
    },
  },
];
