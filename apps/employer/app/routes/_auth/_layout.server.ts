import type { DataFunctionArgs } from '@vercel/remix';

import { requireUnauthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: DataFunctionArgs) => {
  await requireUnauthenticatedUser(args);

  return null;
};
