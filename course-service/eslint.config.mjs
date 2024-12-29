import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Ensure TypeScript and JavaScript files are properly linted
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Adding browser globals for both JS and TS files if your code is running in a browser environment
        ...globals.node,    // Add Node.js globals if you're also targeting Node.js
      },
    },
  },
  pluginJs.configs.recommended, // Use the recommended JavaScript rules from @eslint/js
  ...tseslint.configs.recommended, // Use the recommended TypeScript rules from typescript-eslint plugin
  {
    files: ["**/*.ts", "**/*.tsx"], // Additional settings for TypeScript files (if you're using React with TSX, adjust accordingly)
    parser: "@typescript-eslint/parser", // Use TypeScript parser
    parserOptions: {
      ecmaVersion: 2020, // Use ECMAScript 2020 syntax (you can adjust based on your needs)
      sourceType: "module", // Enable ES module syntax
      project: "./tsconfig.json", // Specify the location of the tsconfig.json file for TypeScript type checking
    },
    plugins: ["@typescript-eslint"], // Enable TypeScript-specific linting rules
    rules: {
      // You can override/add specific rules here for TypeScript files
      "@typescript-eslint/explicit-module-boundary-types": "off", // For example, turning off this rule (change as per your requirements)
    },
  },
];
