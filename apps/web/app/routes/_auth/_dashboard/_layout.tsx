import { Outlet } from '@remix-run/react';

import { SidebarTrigger } from '@technifit/ui/sidebar';

import { AppSidebar } from '~/ui/dashboard/app-sidebar';

const AuthLayout = () => {
  return (
    <>
      <AppSidebar />
      <main className='container flex grow py-4'>
        <SidebarTrigger />
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
