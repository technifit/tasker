import type { LoaderArgs } from '@vercel/remix';
import { defer } from '@vercel/remix';

export const loader = ({ context, params, request }: LoaderArgs) => {
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
