import { z } from 'zod';

const envSchema = z.object({
  CLOUDFLARE_ANALYTICS_TOKEN: z.string(),
  NODE_ENV: z.literal('production').or(z.literal('development')).or(z.literal('test')),
  SENTRY_DSN: z.string().url(),
  SESSION_SECRET: z.string().uuid(),
  WORKOS_API_KEY: z.string(),
  WORKOS_CLIENT_ID: z.string(),
});

const publicEnvSchema = envSchema.pick({
  CLOUDFLARE_ANALYTICS_TOKEN: true,
  SENTRY_DSN: true,
  NODE_ENV: true,
});

export { envSchema, publicEnvSchema };
