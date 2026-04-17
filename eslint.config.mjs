import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored packages that should not be linted by project rules
    "vendor/**",
  ]),
  // Project-wide rules and plugins to enforce architecture boundaries.
  {
    plugins: { import: importPlugin },
    rules: {
      // Enforce consistent import ordering for readability.
      "import/order": [
        "error",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "pathGroups": [
            { pattern: "@/**", group: "internal" }
          ],
          "alphabetize": { order: "asc", caseInsensitive: true }
        }
      ],
      // Prevent importing deep internal modules; prefer barrels/public API.
      "import/no-internal-modules": [
        "error",
        {
          "allow": [
            "@/lib/**",
            "@/components/**",
            "@/features/*/index",
            "@/types/**"
          ]
        }
      ],
      // Disallow certain deep import patterns that break module boundaries.
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            "@/features/*/*/*",
            "@/components/*/*/*",
            "@/lib/**/internal/**"
          ]
        }
      ]
    },
  }
,
  {
    files: ["**/*.test.*", "**/tests/**", "tests/**"],
    rules: {
      "import/no-extraneous-dependencies": "off"
    }
  }
]);

export default eslintConfig;
