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
    // Vendored packages and perf scripts that should not be linted by project rules
    "vendor/**",
    ".perf/**",
  ]),
  // Project-wide rules and plugins to enforce architecture boundaries.
  {
    plugins: { import: importPlugin },
    rules: {
      // Enforce consistent import ordering for readability (warn during refactor).
      "import/order": [
        "warn",
        {
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
          "pathGroups": [
            { pattern: "@/**", group: "internal" }
          ],
          "alphabetize": { order: "asc", caseInsensitive: true }
        }
      ],
      // Relax internal modules rule during refactor: warn instead of error.
      "import/no-internal-modules": [
        "warn",
        {
          "allow": [
            "@/lib/**",
            "@/components/**",
            "@/contexts/**",
            "@/features/auth",
            "@/features/*/index",
            "@/hooks/**",
            "@/i18n/**",
            "@/types/**",
            "@zcorvus/**",
            "next/**"
          ]
        }
      ],
      // Disallow certain deep import patterns that break module boundaries.
      "no-restricted-imports": [
        "warn",
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
