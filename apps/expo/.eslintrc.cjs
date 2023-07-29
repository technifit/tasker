/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: ["@technifit/eslint-config/base", "@technifit/eslint-config/react"],
  rules: {
    // TODO: Enable later when this app is implemented properly
    "@typescript-eslint/no-unused-vars": "off",
  },
};

module.exports = config;
