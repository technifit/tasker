import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
  entry: ['./src/new-id.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  minify: !opts.watch,
  clean: !opts.watch,
  dts: true,
  outDir: 'dist',
}));
