import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import unicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "coverage/", "eslint.config.js", "scripts/**", "src/generated/**"] },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  unicorn.configs.recommended,

  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "no-console": "error",
      eqeqeq: ["error", "always"],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      // Public API reads first; helpers follow what uses them.
      "unicorn/consistent-class-member-order": "off",
      // lemonfiber serves plain HTTP on loopback: C6-R7 forbids self-signed TLS
      // by default, and C6-R6 requires saying so rather than papering over it.
      "unicorn/prefer-https": "off",
    },
  },

  {
    files: ["src/**/*.test.ts"],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      // Fixture setup nests by nature; flattening it into named variables makes
      // a test harder to read, not easier. Both rules stay on for src/.
      "unicorn/max-nested-calls": "off",
      "unicorn/consistent-function-scoping": "off",
    },
  },

  { files: ["*.config.ts", "scripts/**"], ...tseslint.configs.disableTypeChecked },
);
