import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createCookieSessionStorage } from '@remix-run/node';
import type { AppLoadContext } from '@remix-run/node';
import type { ServerBuild } from '@remix-run/server-runtime';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { remix } from 'remix-hono/handler';
import { session } from 'remix-hono/session';
import { typedEnv } from 'remix-hono/typed-env';

import { importDevBuild } from './dev/server';
import { envSchema } from './env';
import type { Env } from './env';
import { cache } from './middleware/cache';

const mode = process.env.NODE_ENV === 'test' ? 'development' : process.env.NODE_ENV;

const isProductionMode = mode === 'production';

const app = new Hono();

app.get('/health-check', (c) => c.text('Healthy', 200));

/**
 * Serve assets files from build/client/assets
 */
app.use(
  '/assets/*',
  cache(60 * 60), // 1 hour
  serveStatic({ root: './build/client' }),
);

/**
 * Serve public files
 */
app.use('*', cache(60 * 60), serveStatic({ root: isProductionMode ? './build/client' : './public' })); // 1 hour

/**
 * Add logger middleware
 */
app.use('*', logger());

/**
 * Add session middleware (https://github.com/sergiodxa/remix-hono?tab=readme-ov-file#session-management)
 */
app.use(
  session({
    autoCommit: true,
    createSessionStorage(c) {
      const env = typedEnv(c, envSchema);

      if (!env.SESSION_SECRET) {
        throw new Error('SESSION_SECRET is not defined');
      }

      const sessionStorage = createCookieSessionStorage({
        cookie: {
          name: 'session',
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secrets: [env.SESSION_SECRET],
          secure: env.NODE_ENV === 'production',
        },
      });

      return {
        ...sessionStorage,
        // If a user doesn't come back to the app within 30 days, their session will be deleted.
        async commitSession(session) {
          return sessionStorage.commitSession(session);
        },
      };
    },
  }),
);

/**
 * Add remix middleware to Hono server
 */
app.use(async (c, next) => {
  const build = (isProductionMode
    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await import('../build/server/remix.js')
    : await importDevBuild()) as unknown as ServerBuild;

  return remix({
    // @ts-expect-error remix-hono types are not up to date
    build,
    mode,
    getLoadContext(c) {
      // Typed environment variables
      const env = typedEnv(c, envSchema);

      return {
        appVersion: isProductionMode ? build.assets.version : 'dev',
        env,
      } satisfies AppLoadContext;
    },
  })(c, next);
});

/**
 * Start the production server
 */

if (isProductionMode) {
  serve(
    {
      ...app,
      port: Number(process.env.PORT) || 3000,
    },
    (info) => {
      console.log(`🚀 Server started on port ${info.port}`);
    },
  );
}

export default app;

/**
 * Declare our loaders and actions context type
 */
declare module '@remix-run/node' {
  /**
   * Represents the context for loading the app.
   */
  interface AppLoadContext {
    /**
     * The app version from the build assets.
     */
    readonly appVersion: string;
    /**
     * The environment variables.
     */
    readonly env: Env;
  }
}
