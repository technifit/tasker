import { vitePlugin as remix } from '@remix-run/dev';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import dotenv from 'dotenv';
import { remixDevTools } from 'remix-development-tools';
import { expressDevServer } from 'remix-express-dev-server';
import { flatRoutes } from 'remix-flat-routes';
import { remixRoutes } from 'remix-routes/vite';
import { defineConfig } from 'vite';
import { envOnlyMacros } from 'vite-env-only';
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
    target: 'esnext',
    sourcemap: true,
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
    expressDevServer(),
    envOnlyMacros(),
    tsconfigPaths(),
    remixDevTools(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true,
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
    }),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
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
