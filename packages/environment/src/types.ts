import type { ServerContext } from 'remix-create-express-app/context';
import type { z } from 'zod';

import type { envSchema, publicEnvSchema } from './schema';

type Env = z.infer<typeof envSchema>;
type PublicEnv = z.infer<typeof publicEnvSchema>;

interface AppContext extends ServerContext {
  /**
   * The environment variables.
   */
  readonly env: Env;
}

export type { Env, PublicEnv, AppContext };
