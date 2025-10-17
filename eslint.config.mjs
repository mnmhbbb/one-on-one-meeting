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
  // 제외할 파일들
  {
    ignores: [".next/**/*", "public/**/*", "node_modules/**/*", "dist/**/*", "build/**/*"],
  },
  ...tseslint.configs.recommended, // 기본 TypeScript 규칙
  ...compat.extends("next/core-web-vitals", "next/typescript"), // Next.js + TS 규칙
  // 커스텀 규칙:
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      import: eslintPluginImport,
      "unused-imports": eslintPluginUnusedImports,
      prettier: prettierPlugin,
    },
    rules: {
      // Import 관련 규칙
      "import/order": [
        "warn",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-duplicates": "error", // 중복 import 방지

      // 사용하지 않는 import는 자동 제거, 변수는 경고만
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off", // unused-imports와 중복 방지

      "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 0 }],
      "no-trailing-spaces": "error",

      // TypeScript 규칙
      "@typescript-eslint/no-explicit-any": "off", // 임시로 any 사용 허용
      "prefer-const": "error", // 재할당되지 않는 변수는 let 말고 const 사용

      // Prettier와의 연동
      "prettier/prettier": "error",
    },
  },
  // Prettier 설정 충돌 제거
  {
    ...prettierConfig,
  },
];

export default config;
