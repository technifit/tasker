// app/environment.server.ts
import pick from 'lodash/pick';
import * as z from 'zod';

const environmentSchema = z.object({
  SENTRY_DSN: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SESSION_SECRET: z.string().uuid(),
  VERCEL_ENV: z
    .enum(['production', 'preview', 'development'])
    .default('development'),
});

const environment = () => environmentSchema.parse(process.env);

const getPublicKeys = () => {
  return {
    publicKeys: pick(environment(), ['NODE_ENV', 'SENTRY_DSN', 'VERCEL_ENV']),
  };
};

export { environment, getPublicKeys };
