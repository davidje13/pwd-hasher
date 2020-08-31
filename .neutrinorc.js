const airbnbBase = require('@neutrinojs/airbnb-base');
const library = require('@neutrinojs/library');
const jest = require('@neutrinojs/jest');
const typescript = require('neutrinojs-typescript');
const typescriptLint = require('neutrinojs-typescript-eslint');

module.exports = {
  options: {
    root: __dirname,
    tests: 'src',
  },
  use: [
    typescript({ tsconfig: {
      compilerOptions: {
        strict: true,
        declaration: true,
      },
    } }),
    typescriptLint(),
    airbnbBase({
      eslint: {
        rules: {
          'arrow-parens': ['error', 'always'],
          'operator-linebreak': ['error', 'after'],
          '@typescript-eslint/indent': ['error', 2],
          '@typescript-eslint/await-thenable': ['error'],
          '@typescript-eslint/member-ordering': ['error'],
          '@typescript-eslint/no-for-in-array': ['error'],
          '@typescript-eslint/no-require-imports': ['error'],
          '@typescript-eslint/no-this-alias': ['error'],
          '@typescript-eslint/no-unnecessary-qualifier': ['error'],
          '@typescript-eslint/no-unnecessary-type-assertion': ['error'],
          '@typescript-eslint/prefer-function-type': ['error'],
          '@typescript-eslint/prefer-includes': ['error'],
          '@typescript-eslint/prefer-regexp-exec': ['error'],
          '@typescript-eslint/prefer-string-starts-ends-with': ['error'],
          '@typescript-eslint/require-array-sort-compare': ['error'],
          '@typescript-eslint/restrict-plus-operands': ['error'],
          '@typescript-eslint/unbound-method': ['error'],
          '@typescript-eslint/explicit-function-return-type': ['error', {
            'allowTypedFunctionExpressions': true,
            'allowHigherOrderFunctions': true,
          }],
          '@typescript-eslint/no-parameter-properties': ['error', {
            'allows': ['private readonly', 'protected readonly'],
          }],
          'import/extensions': ['error', 'never'],
        },
      },
    }),
    library({
      name: 'pwd-hasher',
      target: 'node',
      babel: {
        presets: [
          ['@babel/preset-env', {
            useBuiltIns: false,
            targets: {
              node: '10.15',
            },
          }],
        ],
      },
    }),
    jest(),
  ],
};
