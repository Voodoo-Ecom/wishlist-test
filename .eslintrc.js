module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs,liquid}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: [
      'error',
      2,
      {
        ArrayExpression: 1,
        CallExpression: {
          arguments: 1,
        },
        FunctionDeclaration: {
          body: 1,
          parameters: 1,
        },
        FunctionExpression: {
          body: 1,
          parameters: 1,
        },
        ImportDeclaration: 1,
        MemberExpression: 1,
        ObjectExpression: 1,
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
      },
    ],
    'no-redeclare': 'off',
    'no-tabs': 'error',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    quotes: ['error', 'single'],
    'sort-keys': ['error', 'asc', { caseSensitive: true, natural: false }],
  },
};
