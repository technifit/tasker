import type { DataFunctionArgs } from '@vercel/remix';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: DataFunctionArgs) => {
  await requireAuthenticatedUser(args);

  return null;
};
