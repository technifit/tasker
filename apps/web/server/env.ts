import type { Session } from '@remix-run/node';
import { z } from 'zod';

import type { SessionData, SessionFlashData } from '@technifit/middleware/session';

const envSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NODE_ENV: z.literal('production').or(z.literal('development')).or(z.literal('test')),
  SENTRY_DSN: z.string().url(),
  SESSION_SECRET: z.string().uuid(),
  WORKOS_API_KEY: z.string(),
  WORKOS_CLIENT_ID: z.string(),
});

const publicEnvSchema = envSchema.pick({
  SENTRY_DSN: true,
  NODE_ENV: true,
});

type Env = z.infer<typeof envSchema>;
type PublicEnv = z.infer<typeof publicEnvSchema>;

/**
 * Declare our loaders and actions context type
 */
declare module '@remix-run/node' {
  /**
   * Represents the context for loading the app.
   */
  interface AppLoadContext {
    /**
     * The environment variables.
     */
    readonly env: Env;
    session: Session<SessionData, SessionFlashData>;
  }
}

export { envSchema, publicEnvSchema };
export type { Env, PublicEnv };
