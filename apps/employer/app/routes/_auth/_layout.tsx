import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@vercel/remix';

import { requireUnauthenticatedUser } from '~/lib/guards/auth-guard.server';

export const loader = async (args: LoaderFunctionArgs) => {
  await requireUnauthenticatedUser(args);

  return null;
};

const Layout = () => {
  return (
    <div className='container flex flex-col md:h-screen md:flex-row-reverse'>
      <div className='mx-auto flex w-full items-start md:w-1/3 md:items-center'></div>
      <div className='flex grow justify-center md:w-2/3 md:border-r'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
