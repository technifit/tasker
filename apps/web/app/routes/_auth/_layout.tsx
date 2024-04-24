import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { UserNav } from './components/user-nav';

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker' }, { name: 'description', content: 'Large scale job processing done right' }];
};

export const Layout = () => {
  return (
    <main className='container grid grow grid-cols-1 py-4 lg:grid-cols-1'>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-end'>
          <UserNav />
        </div>
        <div className='flex grow flex-col items-center justify-center'>
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Layout;
