import { fileURLToPath } from 'node:url';
import { includeIgnoreFile } from '@eslint/compat';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import globals from 'globals';
import path from 'node:path';

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore');

/** @type {import('eslint').Linter.Config[]} */
export default [
  includeIgnoreFile(gitignorePath),
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended
];
