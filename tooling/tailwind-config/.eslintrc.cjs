/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['@technifit/eslint-config/base'],
  root: true,
  parserOptions: {
    project: true,
  },
};

module.exports = config;
