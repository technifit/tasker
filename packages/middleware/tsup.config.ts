import { defineConfig } from 'tsup';

export default defineConfig((opts) => ({
  entry: ['./src/cache.ts', './src/access-token.ts', './src/idempotency.ts'],
  format: ['esm'],
  splitting: true,
  sourcemap: true,
  minify: !opts.watch,
  clean: !opts.watch,
  dts: true,
  outDir: 'dist',
}));
