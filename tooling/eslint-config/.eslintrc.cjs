/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['./base'],
  root: true,
  parserOptions: {
    project: true,
  },
};

module.exports = config;
