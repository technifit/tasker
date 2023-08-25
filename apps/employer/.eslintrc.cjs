/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ['@technifit/eslint-config/remix', '@technifit/eslint-config/react'],
};

module.exports = config;
