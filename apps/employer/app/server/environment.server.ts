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

// try {
//   environmentSchema.parse(process.env);
// } catch (err) {
//   if (err instanceof z.ZodError) {
//     const { fieldErrors } = err.flatten();
//     const errorMessage = Object.entries(fieldErrors)
//       .map(([field, errors]) =>
//         errors ? `${field}: ${errors.join(', ')}` : field,
//       )
//       .join('\n  ');
//     throw new Error(`Missing environment variables:\n  ${errorMessage}`);

//     process.exit(1);
//   }
// }
