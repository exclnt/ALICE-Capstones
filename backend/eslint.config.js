import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import daStyle from "eslint-config-dicodingacademy";
import prettierConfig from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export default defineConfig([
  js.configs.recommended,
  daStyle,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "prettier/prettier": "warn",
    },
  },
  prettierConfig,
]);