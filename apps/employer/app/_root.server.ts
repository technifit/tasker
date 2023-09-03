import type { DataFunctionArgs } from '@vercel/remix';
import { json } from '@vercel/remix';

import { getTheme } from './routes/resources+/theme/theme.server';
import { getPublicKeys } from './server/environment.server';
import { getHints } from './utils/client-hints';

export async function loader({ request }: DataFunctionArgs) {
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
    ...getPublicKeys(),
  });
}
