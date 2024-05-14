/* eslint-disable import/extensions */
/* eslint-disable global-require */
/** @type {import("eslint").Linter.Config} */
const config = {
  ...require("@repo/eslint-config/next.js"),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
};
module.exports = config;
