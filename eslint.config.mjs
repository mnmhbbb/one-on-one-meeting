import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  // // 기본 Next.js + TypeScript 규칙
  // ...tseslint.configs.recommended,
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   languageOptions: {
  //     parser: tseslint.parser,
  //     parserOptions: {
  //       project: "./tsconfig.json",
  //       sourceType: "module",
  //     },
  //   },
  //   plugins: {
  //     import: eslintPluginImport,
  //     "unused-imports": eslintPluginUnusedImports,
  //     prettier: prettierPlugin,
  //   },
  //   rules: {
  //     // import 정렬
  //     "import/order": [
  //       "warn",
  //       {
  //         groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
  //         "newlines-between": "always",
  //         alphabetize: {
  //           order: "asc",
  //           caseInsensitive: true,
  //         },
  //       },
  //     ],
  //     // 사용하지 않는 import 제거
  //     "unused-imports/no-unused-imports": "error",
  //     "unused-imports/no-unused-vars": [
  //       "warn",
  //       {
  //         vars: "all",
  //         varsIgnorePattern: "^_",
  //         args: "after-used",
  //         argsIgnorePattern: "^_",
  //       },
  //     ],
  //     // 코드 스타일
  //     quotes: ["error", "double"],
  //     semi: ["error", "always"],
  //     "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
  //     "no-trailing-spaces": "error",
  //     "@typescript-eslint/no-explicit-any": "warn",
  //     // Prettier와의 연동
  //     "prettier/prettier": "error",
  //   },
  // },
  // // Prettier 설정 충돌 제거
  // {
  //   ...prettierConfig,
  // },
  // ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
