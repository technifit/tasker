import { Outlet } from '@remix-run/react';

// TODO implement middleware to only allow unauthenticated users to access this route -- https://linear.app/technifit/issue/TASK-97/create-middleware-to-only-allow-unauthorised-users
export const loader = () => {
  return null;
};

const Layout = () => {
  return (
    <main className='container flex grow flex-col'>
      <div className='mx-auto flex w-full items-start md:w-1/3 md:items-center'></div>
      <div className='flex grow justify-center md:w-2/3 md:border-r'>
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
