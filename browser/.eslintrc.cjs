module.exports = {
  root: true,

  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    'airbnb',
    'react-app',
    'react-app/jest',
    'plugin:react/recommended',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],

  settings: {
    react: { version: 'detect' },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },

    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-console': 0,
    'import/order': 0,

    'consistent-return': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],

    'import/extensions': 'off',
    'react/react-in-jsx-scope': 'off',

    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'warn',

    'import/no-extraneous-dependencies': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
