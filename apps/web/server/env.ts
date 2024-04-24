import { z } from 'zod';

const envSchema = z.object({
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  SESSION_SECRET: z.string().uuid(),
  NODE_ENV: z.literal('production').or(z.literal('development')).or(z.literal('test')),
});

type Env = z.infer<typeof envSchema>;

export { envSchema };
export type { Env };
