module.exports = {
  // Tells ESLint to stop looking for the config file when it reaches the project root directory
  root: true,

  // Which environments is your script meant to run <input type="text" name="" id=""/>
  env: {
    browser: true,
    es2021: true, // What level of Javascript should be allowed, enables ES2021 features in JS
    node: true,
  },

  // These values are shareable configurations, that is npm packages that expose a configuration object for eslint to extend our configurations with
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
  ],

  parserOptions: {
    // Object which details any additional ECMAScript features you would like to use
    ecmaFeatures: {
      jsx: true,
    },

    ecmaVersion: 12, // Version of ECMAScript to use, influences the kinds of JS features that will be available

    // Can either be "script", which is default, or "module" if you plan on using ECMAScript modules. No difference between the two options other than the usage or 'import' and 'export'
    sourceType: 'module',
  },

  // Allows extending a plugin file (eslint-plugin-<name>)
  // Plugins add custom capabilities that aren't implemented in the ESlint core. Essentially they are like supplements for ESlint so it can tackle more things
  plugins: [
    'react',
    'prettier',
    'better-styled-components',
    'react-hooks',
    'jsx-a11y',
    'filenames',
  ],

  settings: {
    // To remove eslint version detection warning for react
    react: {
      version: 'detect',
    },
  },

  // Used to fine-grain eslint and customize just what we want Eslint to enforce or not. Allows us to modify the way Eslint works
  /* "off" or 0 - turn the rule off
		"warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
		"error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
*/
  rules: {
    indent: ['error', 2],
    'better-styled-components/sort-declarations-alphabetically': 2,

    quotes: ['error', 'single'],
    semi: ['error', 'always'],

    'no-eval': ['error'],
    'linebreak-style': ['error', 'unix'],

    'prettier/prettier': ['error'],
    'react-hooks/rules-of-hooks': 'error',

    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-uses-vars': 2,

    'react/jsx-uses-react': 2,
    'react/react-in-jsx-scope': 0,

    'react/no-array-index-key': 2,
    'react/no-danger': 2,

    'filenames/match-exported': [0, ['camel', 'pascal']],

    camelcase: [
      2,
      {
        properties: 'always',
        ignoreDestructuring: false,
        ignoreImports: true,
        ignoreGlobals: true,
      },
    ],
  },
};
