module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
    // "cypress/globals": true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    'plugin:cypress/recommended'
  ],
  rules: {
    'template-curly-spacing': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'indent' : "off",
    // Best Practices
    'eqeqeq': 'error',
    'no-invalid-this': 'error',
    'no-return-assign': 'off',
    'no-unused-expressions': ['error', { 'allowTernary': true }],
    'no-useless-concat': 'error',
    'no-useless-return': 'error',

    // Variable
    'init-declarations': 'error',
    'no-use-before-define': 'error',

    // Stylistic Issues
    // 'array-bracket-newline': ['error', { 'multiline': true, 'minItems': null }],
    'array-bracket-newline': 'off',
    'array-bracket-spacing': 'error',
    // 'brace-style': ["error", "1tbs", { "allowSingleLine": true }],
    'brace-style': 'off',
    'block-spacing': 'error',
    'comma-dangle': 'error',
    'comma-spacing': 'error',
    'comma-style': 'error',
    'computed-property-spacing': 'error',
    'func-call-spacing': 'error',
    // 'implicit-arrow-linebreak': ['error', 'beside'],
    'implicit-arrow-linebreak': 'off',
    'indent': ['error', 2],
    'keyword-spacing': 'error',
    'multiline-ternary': ['error', 'never'],
    'no-lonely-if': 'error',
    'no-mixed-operators': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 5, 'maxEOF': 1 }],
    // 'no-tabs': 'error',
    'no-tabs': 'off',
    'no-unused-vars': 'off',
    'no-unneeded-ternary': 'error',
    'no-whitespace-before-property': 'error',
    'nonblock-statement-body-position': 'error',
    'no-extra-boolean-cast': 'off', //caga el !!~indexOf
    // 'object-property-newline': ["error", { "allowAllPropertiesOnSameLine": true }],
    'object-property-newline': 'off',
    'quote-props': ['error', 'consistent'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'semi-spacing': 'error',
    'space-before-blocks': 'error',
    // 'space-before-function-paren': 'error',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',

    // ES6
    'arrow-spacing': 'error',
    // 'no-confusing-arrow': 'error',
    'no-confusing-arrow': 'off',
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-const': 'error',
    'prefer-template': 'error',

    // Vue
    'vue/no-use-v-if-with-v-for': 'off',
    "vue/html-quotes": ["error", "double"]
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    allowImportExportEverywhere: true
  }
}
