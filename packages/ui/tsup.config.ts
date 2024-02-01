// import { readFile, writeFile } from "fs/promises";
import { exec } from 'child_process';
import { defineConfig } from 'tsup';

// import type { Options } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  format: ['esm'],
  entry: ['./src/index.ts'],
  external: ['react'],
  minify: true,
  outDir: 'dist',
  sourcemap: true,
  // eslint-disable-next-line @typescript-eslint/require-await
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly');
  },
  tsconfig: 'tsconfig.json',
});
