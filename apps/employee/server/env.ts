import { z } from 'zod';

const envSchema = z.object({
  SESSION_SECRET: z.string().uuid(),
  NODE_ENV: z.literal('production').or(z.literal('development')).or(z.literal('test')),
});

type Env = z.infer<typeof envSchema>;

export { envSchema };
export type { Env };
