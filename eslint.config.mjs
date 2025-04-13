import { defineConfig } from "eslint";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-next";

export default defineConfig({
  extends: [
    "eslint:recommended",
    pluginReact.configs.recommended,
    "plugin:js/recommended"
  ],
  languageOptions: {
    globals: {
      ...globals.browser
    },
  },
  plugins: {
    js,
    react: pluginReact,
  },
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,jsx}"],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
  ],
});
