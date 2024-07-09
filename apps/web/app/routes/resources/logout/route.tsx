import { useEffect } from 'react';
import type { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { $path } from 'remix-routes';

import { getLogOutUrl } from '@technifit/authentication/get-log-out-url';
import { decodeAccessToken } from '@technifit/jwt/decode-access-token';
import { SessionContext } from '@technifit/middleware/session';

import { useWipeSession } from '../wipe-session/route';

export const action = ({ context }: ActionFunctionArgs) => {
  const sessionContext = context.get(SessionContext);

  const token = decodeAccessToken({ accessToken: sessionContext.get('access_token')! });

  if (!token) {
    return null;
  }

  const logOutUrl = getLogOutUrl({ sessionId: token.sid });

  return {
    logOutUrl,
  };
};

const useLogout = () => {
  const { wipeSession } = useWipeSession();
  const fetcher = useFetcher<typeof action>();
  const url = fetcher.data?.logOutUrl;

  useEffect(() => {
    if (url) {
      window.location.href = url;
    }
  }, [url]);

  const logOut = () => {
    fetcher.submit({}, { method: 'POST', action: $path('/resources/logout') });
    wipeSession();
  };

  return { logOut };
};

export { useLogout };
