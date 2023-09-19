import { Link, Outlet } from '@remix-run/react';
import { type V2_MetaFunction } from '@vercel/remix';

import { Typography } from '@technifit/ui';
import { $path } from 'remix-routes';
import { UserNav } from './components/user-nav';

// export const config = { runtime: 'edge' };


export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Tasker' },
    { name: 'description', content: 'Large scale job processing done right' },
  ];
};

export const Index = () => {

  return <div className='container py-4 grid grid-cols-1 lg:grid-cols-1'>
    <div className='flex flex-col gap-2'>
      <div className='flex justify-end'>
        <UserNav />
      </div>
      <div className='grow flex flex-col justify-center items-center'>
        <Outlet />
      </div>
    </div>
  </div>;
}

export default Index
