// ESLint flat config (ESLint 9) — TypeScript + Jest
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: ["dist/", "node_modules/", "coverage/", ".github/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
      parserOptions: {
        // Decorators are enabled via tsconfig for class-validator models.
        requireConfigFile: false,
      },
    },
    rules: {
      // Consistent with the codebase: allow `_`-prefixed unused args.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // Prisma/Express commonly use `any` at boundaries; warn instead of fail.
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
    },
  },
  {
    files: ["tests/**/*.ts", "**/*.spec.ts", "**/*.test.ts"],
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
