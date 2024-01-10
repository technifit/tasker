import type { LoaderFunctionArgs } from '@vercel/remix';

import { requireUnauthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireUnauthenticatedUser(args);

  return null;
};
