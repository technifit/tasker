import { Outlet } from '@remix-run/react';
import { serverOnly$ } from 'vite-env-only/macros';

import { withoutAuthentication } from '@technifit/middleware/unauthenticated';

export const middleware = serverOnly$([withoutAuthentication]);

export const loader = () => {
  return null;
};

const Layout = () => {
  return (
    <main className='container flex grow flex-row'>
      <div className='flex grow justify-center md:w-2/3 md:border-r'>
        <Outlet />
      </div>
      <div className='invisible overflow-hidden md:visible md:w-1/3'></div>
    </main>
  );
};

export default Layout;
