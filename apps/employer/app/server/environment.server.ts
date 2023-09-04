// app/environment.server.ts
import pick from 'lodash/pick';
import * as z from 'zod';

const environmentSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SENTRY_DSN: z.string().url(),
  SESSION_SECRET: z.string().uuid(),
  VERCEL_ENV: z
    .enum(['production', 'preview', 'development'])
    .default('development'),
});

const environment = () => environmentSchema.parse(process.env);

const getPublicKeys = () => {
  return {
    publicKeys: pick(environment(), [
      'CLERK_PUBLISHABLE_KEY',
      'NODE_ENV',
      'SENTRY_DSN',
      'VERCEL_ENV',
    ]),
  };
};

export { environment, getPublicKeys };
