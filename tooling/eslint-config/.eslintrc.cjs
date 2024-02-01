/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['./base'],
  root: true,
  parserOptions: {
    project: './tsconfig.json',
  },
};

module.exports = config;
