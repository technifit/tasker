// app/environment.server.ts
import pick from 'lodash/pick';
import * as z from 'zod';

const environmentSchema = z.object({
  SENTRY_DSN: z.string().url(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  SESSION_SECRET: z.string().uuid(),
});

const environment = () => environmentSchema.parse(process.env);

const getPublicKeys = () => {
  return {
    publicKeys: pick(environment(), ['NODE_ENV', 'SENTRY_DSN']),
  };
};

export { environment, getPublicKeys };
