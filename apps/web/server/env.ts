import { z } from 'zod';

const envSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  SESSION_SECRET: z.string().uuid(),
  NODE_ENV: z.literal('production').or(z.literal('development')).or(z.literal('test')),
  SENTRY_DSN: z.string().url(),
});

const publicEnvSchema = envSchema.pick({
  SENTRY_DSN: true,
  NODE_ENV: true,
});

type Env = z.infer<typeof envSchema>;
type PublicEnv = z.infer<typeof publicEnvSchema>;

export { envSchema, publicEnvSchema };
export type { Env, PublicEnv };
