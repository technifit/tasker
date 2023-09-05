import type { LoaderArgs } from '@vercel/remix';
import { defer } from '@vercel/remix';

import { requireAuthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderArgs) => {
  await requireAuthenticatedUser(args);

  return defer({
    proxyRegion: new Promise<string>((resolve) =>
      setTimeout(() => resolve('EU'), 2500),
    ),
    computeRegion: new Promise<string>((resolve) =>
      setTimeout(() => resolve('IE'), 3500),
    ),
    date: new Date().toISOString(),
  });
};
