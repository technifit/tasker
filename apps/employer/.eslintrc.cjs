/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['@technifit/eslint-config/base', '@technifit/eslint-config/react'],
  ignorePatterns: ['types/remix-routes.d.ts'],
  root: true,
  parserOptions: {
    project: true,
  },
};

module.exports = config;
