import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Existing recommended rules from Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 🛠️ Custom rule overrides
  {
    rules: {
      'react/no-unescaped-entities': 'off', // 👈 this disables the quote error
    },
  },
];

export default eslintConfig;
