import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { serverOnly$ } from 'vite-env-only/macros';

import { withAuthentication } from '@technifit/middleware/authenticated';
import { SessionContext } from '@technifit/middleware/session';

export const middleware = serverOnly$([withAuthentication]);

export const loader = ({ context }: LoaderFunctionArgs) => {
  const sessionContext = context.get(SessionContext);
  const user = sessionContext.get('user');

  if (!user) {
    throw new Error('No user found');
  }

  return {
    user,
  };
};
const AppLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default AppLayout;
