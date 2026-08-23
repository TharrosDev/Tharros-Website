import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // The Playwright suite is not React. Every fixture is `async ({...}, use)`
    // and calls `use(...)`, which `rules-of-hooks` reads as React's `use` hook
    // being called outside a component — so the rule fails on the fixture
    // shape itself rather than on anything wrong. Scoped off here rather than
    // suppressed line by line in every fixture that will ever be written.
    files: ["e2e/**/*.ts", "playwright.config.ts"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
