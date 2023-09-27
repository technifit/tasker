// import { readFile, writeFile } from "fs/promises";
import { exec } from 'child_process';
import { defineConfig } from 'tsup';

// import type { Options } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  entry: ['./src/index.ts'],
  external: ['react'],
  minify: true,
  outDir: 'dist',
  sourcemap: true,
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly');
  },
  tsconfig: 'tsconfig.json',
});
