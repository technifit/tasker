/** @type {import('eslint').Linter.Config} */
const config = {
  extends: [
    '@technifit/eslint-config/base',
    '@technifit/eslint-config/react',
  ],
  root: true,
  parserOptions: {
    project: true,
  },
};

module.exports = config;
