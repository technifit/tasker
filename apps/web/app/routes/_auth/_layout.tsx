import { Outlet } from '@remix-run/react';
import { serverOnly$ } from 'vite-env-only/macros';

import { withAuthentication } from '@technifit/middleware/authenticated';

export const middleware = serverOnly$([withAuthentication]);

const AppLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default AppLayout;
