import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import * as atPlug from "./at.js"
const config = [{
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...atPlug.default.globals
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {

    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": "off",
    }
  }, {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
  }, {
    ignores: ['cli/*'],
  }
]
export default config;