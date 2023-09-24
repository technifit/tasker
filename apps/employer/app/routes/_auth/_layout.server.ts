import type { LoaderArgs } from '@vercel/remix';

import { requireUnauthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderArgs) => {
  await requireUnauthenticatedUser(args);

  return null;
};
