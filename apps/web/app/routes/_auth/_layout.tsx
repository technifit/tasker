import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { cn } from '@technifit/ui/utils';

import { Navbar } from '~/ui/admin/navbar';
import { Sidebar } from '~/ui/admin/sidebar';

export const meta: MetaFunction = () => {
  return [{ title: 'Tasker' }, { name: 'description', content: 'Large scale job processing done right' }];
};

const AuthLayout = () => {
  // TODO: Replace with real data
  const sidebar = {
    isOpen: true,
  };

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          'grow bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
          sidebar?.isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        <Navbar />
        <div className='container'>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
