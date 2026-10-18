import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      // artifacts/ holds captured third-party bundles and evidence output, not our source.
      'artifacts/**',
      // evidence/<date>/ holds captured pages and screenshots kept as proof, not our source.
      'evidence/**',
      'content/admin-config.json',
      'content/cash-scrape-cache.json',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
