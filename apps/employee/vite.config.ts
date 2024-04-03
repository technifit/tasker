import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { vitePlugin as remix } from '@remix-run/dev';
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { remixDevTools } from 'remix-development-tools';
import { flatRoutes } from 'remix-flat-routes';
import { remixRoutes } from 'remix-routes/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Load environment variables from .env file at the root of your monorepo
dotenv.config({ path: '../../.env' });

export default defineConfig({
  server: {
    port: 3000,
    // TODO: Uncomment the following lines to enable HTTPS once we figure out playwright https issue with self-signed certs on macOS
    //https: {
    //key: './server/dev/key.pem',
    //cert: './server/dev/cert.pem',
    //},
    // https://github.com/remix-run/remix/discussions/8917#discussioncomment-8640023
    warmup: {
      clientFiles: ['./app/entry.client.tsx', './app/root.tsx', './app/routes/**/*'],
    },
  },
  // https://github.com/remix-run/remix/discussions/8917#discussioncomment-8640023
  optimizeDeps: {
    include: ['./app/routes/**/*'],
  },
  build: {
    // Todo: Remove this once https://github.com/vitejs/vite/issues/15012 is fixed
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }

        defaultHandler(warning);
      },
    },
  },
  plugins: [
    devServer({
      injectClientScript: false,
      entry: 'server/index.ts', // The file path of your server.
      exclude: [/^\/(app)\/.+/, /^\/@.+$/, /^\/node_modules\/.*/],
    }),
    tsconfigPaths(),
    remixDevTools(),
    remix({
      serverBuildFile: 'remix.js',
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      routes: (defineRoutes) => {
        return flatRoutes('routes', defineRoutes, {
          ignoredRouteFiles: [
            '.*',
            '**/*.css',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__*.*',
            // This is for server-side utilities you want to colocate next to
            // your routes without making an additional directory.
            // If you need a route that includes "server" or "client" in the
            // filename, use the escape brackets like: my-route.[server].tsx
            '**/*.server.*',
            '**/*.client.*',
          ],
        });
      },
      buildEnd: async () => {
        await esbuild
          .build({
            alias: { '~': './app' },
            // The final file name
            outfile: 'build/server/index.js',
            // Our server entry point
            entryPoints: ['server/index.ts'],
            // Dependencies that should not be bundled
            // We import the remix build from "../build/server/remix.js", so no need to bundle it again
            external: ['./build/server/*'],
            platform: 'node',
            format: 'esm',
            // Don't include node_modules in the bundle
            packages: 'external',
            bundle: true,
            logLevel: 'info',
          })
          .catch((error: unknown) => {
            console.error(error);
            process.exit(1);
          });
      },
    }),
    remixRoutes({
      strict: true,
      outDir: './types',
    }),
  ],
  ssr: {
    noExternal: ['remix-i18next'],
  },
});
