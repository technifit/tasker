// app/environment.server.ts
import * as z from 'zod';

const environmentSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SENTRY_DSN: z.string().url(),
  SENTRY_AUTH_TOKEN: z.string(),
  SESSION_SECRET: z.string().uuid(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).default('development'),
});

type Environment = z.infer<typeof environmentSchema>;

const environment = () => environmentSchema.parse(process.env);

const publicEnvironmentSchema = environmentSchema.pick({
  CLERK_PUBLISHABLE_KEY: true,
  NODE_ENV: true,
  SENTRY_DSN: true,
  VERCEL_ENV: true,
});

type PublicEnvironment = z.infer<typeof publicEnvironmentSchema>;

const getPublicKeys = () => publicEnvironmentSchema.parse(process.env);

export { environment, getPublicKeys };
export type { Environment, PublicEnvironment };
