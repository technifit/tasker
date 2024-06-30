import { z } from 'zod';

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

export { envSchema, publicEnvSchema };
