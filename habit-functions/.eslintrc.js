/* eslint-disable no-undef */
module.exports = {
  root: true,
env: {
es6: true,
node: true,
commonjs: true,
},
  extends: [
    "eslint:recommended",
  ],
parserOptions: {
ecmaVersion: 2020,
sourceType: "commonjs"
},
globals: {
module: "writable",
require: "writable",
exports: "writable"
},
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double"],
  },
};
