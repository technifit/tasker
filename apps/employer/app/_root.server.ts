import { rootAuthLoader } from '@clerk/remix/ssr.server';
import type { DataFunctionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';

import { getPublicKeys } from './lib/environment/environment.server';
import { getTheme } from './routes/resources+/theme/theme.server';
import { getHints } from './utils/client-hints';

export const loader = async (args: DataFunctionArgs) => {
  return rootAuthLoader(args, async ({ request }) => {
    return json({
      // user,
      requestInfo: {
        hints: getHints(request),
        // origin: getDomainUrl(request),
        // path: new URL(request.url).pathname,
        userPrefs: {
          theme: await getTheme(request),
        },
      },
      publicKeys: {
        ...getPublicKeys(),
      },
    });
  });
};
