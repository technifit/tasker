import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { $path } from 'remix-routes';

import { SessionContext } from '@technifit/middleware/session';

export const action = ({ context }: ActionFunctionArgs) => {
  const sessionContext = context.get(SessionContext);

  if (!sessionContext.has('access_token')) {
    sessionContext.unset('access_token');
    sessionContext.unset('refresh_token');
    sessionContext.unset('user');

    throw redirect($path('/log-in'));
  }

  sessionContext.unset('access_token');
  sessionContext.unset('refresh_token');
  sessionContext.unset('user');

  return null;
};

const useWipeSession = () => {
  const fetcher = useFetcher<typeof action>();

  const wipeSession = () => {
    fetcher.submit({}, { method: 'POST', action: $path('/resources/wipe-session') });
  };

  return { wipeSession };
};

export { useWipeSession };
